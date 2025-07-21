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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.function.ServerResponse.badRequest;
import static org.springframework.web.servlet.function.ServerResponse.status;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private TraderRepository repo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationDTO dto) {
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        TraderInfo t = new TraderInfo();
        t.setName(dto.getName());
        t.setEmail(dto.getEmail());
        t.setPassword(encoder.encode(dto.getPassword()));
        t.setPremium(dto.isPremium());
        t.setRole(dto.isPremium() ? "ROLE_PREMIUM" : "ROLE_USER");
        repo.save(t);
        return ok("Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            UserDetails ud = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.genToken(ud);
            return ok(Map.of("token", token));
        } catch (BadCredentialsException ex) {
            return (ResponseEntity<?>) status(401).body("Invalid credentials");
        }
    }
}
