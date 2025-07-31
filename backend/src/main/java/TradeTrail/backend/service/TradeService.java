package TradeTrail.backend.service;

import TradeTrail.backend.dto.TradeDTO;
import TradeTrail.backend.models.TraderInfo;
import TradeTrail.backend.models.Trades;
import TradeTrail.backend.repository.TradeRepository;
import TradeTrail.backend.repository.TraderRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradeService {
    private final TradeRepository tradeRepository;
    private final TraderRepository traderRepository;    // assuming this for user lookup

    public TradeService(TradeRepository tradeRepository, TraderRepository traderRepository) {
        this.tradeRepository = tradeRepository;
        this.traderRepository = traderRepository;
    }


    public List<TradeDTO> getTradesByUserEmail(String email) {
        TraderInfo trader = traderRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Trades> trades =  tradeRepository.findByTrader(trader);
        return trades.stream().map(trade -> {
            TradeDTO dto = new TradeDTO();
            dto.setId(trade.getId());
            dto.setTradeType(trade.getTradeType());
            dto.setTradeDate(trade.getTradeDate().toString());;
            dto.setEntryPrice(trade.getEntryPrice());
            dto.setExitPrice(trade.getExitPrice());
            dto.setProfitLoss(trade.getProfitLoss());
            dto.setQuantity(trade.getQuantity());
            dto.setStockName(trade.getStockName());
            dto.setInstrument(trade.getInstrument());
            dto.setTraderId((long) trade.getTrader().getId());
            return dto;
        }).collect(Collectors.toList());

    }
    public Trades saveTrade(TradeDTO tradeDTO, String email) {
        Trades trade = new Trades();
        System.out.println(tradeDTO.getTradeDate());
        if (tradeDTO.getTradeDate() == null || tradeDTO.getTradeDate().isEmpty()) {
            throw new IllegalArgumentException("Trade date is missing.");
        }
        trade.setTradeDate(tradeDTO.getTradeDate().toString());
        trade.setStockName(tradeDTO.getStockName());
        trade.setEntryPrice(tradeDTO.getEntryPrice());
        trade.setExitPrice(tradeDTO.getExitPrice());
        trade.setTradeType(tradeDTO.getTradeType());
        trade.setQuantity(tradeDTO.getQuantity());
        trade.setInstrument(tradeDTO.getInstrument());
        // Profit/Loss Calculation
        double profitLoss = calculateProfitLoss(
                tradeDTO.getEntryPrice(),
                tradeDTO.getExitPrice(),
                tradeDTO.getQuantity(),
                tradeDTO.getTradeType()
        );

        trade.setProfitLoss(profitLoss);
        trade.setWin(profitLoss > 0);
        // Associate trader
        TraderInfo trader = traderRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Trader not found"));
        trade.setTrader(trader);

        return tradeRepository.save(trade);
    }
    public boolean updateTrade(Long tradeId, TradeDTO tradeDTO) {
        Trades currentTrade = tradeRepository.findById(tradeId).orElse(null);
        if (currentTrade != null) {
            if (tradeDTO.getTradeDate() == null || tradeDTO.getTradeDate().isEmpty()) {
                throw new IllegalArgumentException("Trade date is missing.");
            }
            currentTrade.setTradeDate(tradeDTO.getTradeDate().toString());
            currentTrade.setStockName(tradeDTO.getStockName());
            currentTrade.setEntryPrice(tradeDTO.getEntryPrice());
            currentTrade.setExitPrice(tradeDTO.getExitPrice());
            currentTrade.setTradeType(tradeDTO.getTradeType());
            currentTrade.setQuantity(tradeDTO.getQuantity());
            currentTrade.setInstrument(tradeDTO.getInstrument());
            // Profit/Loss Calculation
            double profitLoss = calculateProfitLoss(
                    tradeDTO.getEntryPrice(),
                    tradeDTO.getExitPrice(),
                    tradeDTO.getQuantity(),
                    tradeDTO.getTradeType()
            );

            currentTrade.setProfitLoss(profitLoss);
            currentTrade.setWin(profitLoss > 0);

            tradeRepository.save(currentTrade);
            return true;
        }
        return false;
    }
    public boolean deleteTrade(Long tradeId) {
        Trades currentTrade = tradeRepository.findById(tradeId).orElse(null);
        if (currentTrade != null) {
            tradeRepository.deleteById(tradeId);
            return true;
        }
        return false;
    }
    private double calculateProfitLoss(double entryPrice, double exitPrice, int quantity, String tradeType) {

        double profitOrLoss;

        if ("sell".equalsIgnoreCase(tradeType)) {
            profitOrLoss = (entryPrice - exitPrice) * quantity;
        } else if ("buy".equalsIgnoreCase(tradeType)) {
            profitOrLoss = (exitPrice - entryPrice) * quantity;
        } else {
            return 0.0;
        }

        boolean isWin = isWinningTrade(entryPrice, exitPrice, tradeType);
        return isWin ? Math.abs(profitOrLoss) : -Math.abs(profitOrLoss);
    }

    private boolean isWinningTrade(Double entryPrice, Double exitPrice, String tradeType) {
        if ("buy".equalsIgnoreCase(tradeType)) {
            return exitPrice > entryPrice;
        } else if ("sell".equalsIgnoreCase(tradeType)) {
            return entryPrice > exitPrice;
        }
        return false;
    }
}
