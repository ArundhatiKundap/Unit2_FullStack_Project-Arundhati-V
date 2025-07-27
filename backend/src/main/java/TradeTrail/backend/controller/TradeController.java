package TradeTrail.backend.controller;


import TradeTrail.backend.dto.TradeDTO;
import TradeTrail.backend.models.TraderInfo;
import TradeTrail.backend.models.Trades;
import TradeTrail.backend.repository.TraderRepository;
import TradeTrail.backend.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trades")
public class TradeController {

    private final TradeService tradeService;
    private final TraderRepository traderRepository;
    public TradeController(TradeService tradeService, TraderRepository traderRepository) {
        this.tradeService = tradeService;
        this.traderRepository = traderRepository;
    }

    // GET the full list of Trades
    // Endpoint is http://localhost:8080/api/trades
   @GetMapping("")
   public ResponseEntity<?> getAllTrades(@AuthenticationPrincipal UserDetails userDetails) {
       String email = userDetails.getUsername();
       List<Trades> allTrades = tradeService.getTradesByUserEmail(email);
        return new ResponseEntity<>(allTrades, HttpStatus.OK); // 200
   }
    // POST a new Trade
    // Endpoint http://localhost:8080/api/trades/add?newtrade (for example)
    @PostMapping("/add")
    public ResponseEntity<Trades> addTrade(@RequestBody TradeDTO tradeDTO, @RequestParam Long traderId) {
        Trades savedTrade = tradeService.saveTrade(tradeDTO, traderId);
        return ResponseEntity.ok(savedTrade);
    }
}

