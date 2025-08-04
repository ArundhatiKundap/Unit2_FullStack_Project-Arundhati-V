package TradeTrail.backend.controller;


import TradeTrail.backend.dto.TradeDTO;
import TradeTrail.backend.models.Trades;
import TradeTrail.backend.repository.TraderRepository;
import TradeTrail.backend.service.TradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trades")
public class TradeController {

    private final TradeService tradeService;

    public TradeController(TradeService tradeService, TraderRepository traderRepository) {
        this.tradeService = tradeService;
    }

    // GET the full list of Trades
    // Endpoint is http://localhost:8080/api/trades
   @GetMapping("")
   public ResponseEntity<?> getAllTrades(@AuthenticationPrincipal UserDetails userDetails) {
       String email = userDetails.getUsername();
       List<TradeDTO> allTrades = tradeService.getTradesByUserEmail(email);
        return new ResponseEntity<>(allTrades, HttpStatus.OK); // 200
   }
    // POST a new Trade
    // Endpoint http://localhost:8080/api/trades/add (for example)
    @PostMapping("/add")
    public ResponseEntity<Trades> addTrade(@RequestBody TradeDTO tradeDTO, Principal principal) {
        String email = principal.getName();
        Trades savedTrade = tradeService.saveTrade(tradeDTO, email);
        return ResponseEntity.ok(savedTrade);
    }

    @PutMapping("/{traderId}")
    public ResponseEntity<String> updateTrade(@PathVariable (value="traderId") Long traderId, @RequestBody TradeDTO tradeDTO) {
        boolean updated = tradeService.updateTrade(traderId, tradeDTO);
        if (updated) {
            return ResponseEntity.status(HttpStatus.OK).body("Trade updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trade not found");
        }
    }
    @DeleteMapping("/{traderId}")
    public ResponseEntity<String> deleteTrade(@PathVariable (value="traderId") Long traderId) {
        boolean deleted = tradeService.deleteTrade(traderId);
        if (deleted) {
            return ResponseEntity.ok("Trade deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trade not found");
        }
    }
}

