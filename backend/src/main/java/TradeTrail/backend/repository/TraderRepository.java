package TradeTrail.backend.repository;

import TradeTrail.backend.models.TraderInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TraderRepository extends JpaRepository<TraderInfo, Long> {
    Optional<TraderInfo> findByEmail(String email);
}
