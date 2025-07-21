package TradeTrail.backend.service;

import TradeTrail.backend.models.TraderInfo;
import TradeTrail.backend.repository.TraderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private TraderRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        TraderInfo trader = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Trader Not found"));
        return new User(trader.getEmail(), trader.getPassword(),
                List.of(new SimpleGrantedAuthority(trader.getRole())));
    }
}