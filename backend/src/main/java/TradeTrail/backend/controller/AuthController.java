package TradeTrail.backend.controller;

import TradeTrail.backend.config.JwtUtil;
import TradeTrail.backend.dto.LoginDTO;
import TradeTrail.backend.dto.RegistrationDTO;
import TradeTrail.backend.models.TraderInfo;
import TradeTrail.backend.repository.TraderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.function.ServerResponse.badRequest;
import static org.springframework.web.servlet.function.ServerResponse.status;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private TraderRepository traderRepository;
    @Autowired private PasswordEncoder encoder;
    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationDTO dto) {

        if (!Objects.equals(dto.getPassword(), dto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        if (traderRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        TraderInfo t = new TraderInfo();
        t.setName(dto.getName());
        t.setEmail(dto.getEmail());
        t.setPassword(encoder.encode(dto.getPassword()));
        t.setPremium(dto.isPremium());
        t.setRole(dto.isPremium() ? "ROLE_PREMIUM" : "ROLE_USER");
        traderRepository.save(t);
        return ok("Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            UserDetails ud = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.genToken(ud);
            Optional<TraderInfo> user = traderRepository.findByEmail(dto.getEmail());
            TraderInfo trader = user.orElseThrow(() -> new UsernameNotFoundException("User not found"));
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                            "name", trader.getName(),
                            "email", trader.getEmail(),
                            "isPremium", trader.isPremium(),
                            "role", trader.getRole()
                    )
            ));
        } catch (BadCredentialsException ex) {
            return (ResponseEntity<?>) status(401).body("Invalid credentials");
        }
    }
}
