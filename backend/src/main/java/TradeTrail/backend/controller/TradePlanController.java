package TradeTrail.backend.controller;

import TradeTrail.backend.service.TradePlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
    @RestController
    @RequestMapping("/api/trade-plan")
    public class TradePlanController {

        @Autowired
        private TradePlan tradePlan;


    @GetMapping("/{symbol}")
    public ResponseEntity<?> getPlan(@PathVariable String symbol) {
        try {
            String plan = tradePlan.generateTradePlan(symbol);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unable to generate trade plan: " + e.getMessage());
        }
    }
}
