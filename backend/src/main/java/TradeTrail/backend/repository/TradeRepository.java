package TradeTrail.backend.repository;

import TradeTrail.backend.models.TraderInfo;
import TradeTrail.backend.models.Trades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trades, Long> {
    List<Trades> findByTrader(TraderInfo trader);

}

