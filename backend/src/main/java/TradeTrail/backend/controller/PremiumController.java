package TradeTrail.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/premium")
public class PremiumController {
    @GetMapping("/dashboard")
    public String dash() { return "Hello, premium user!"; }
}