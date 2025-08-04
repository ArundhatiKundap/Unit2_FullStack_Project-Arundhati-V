package TradeTrail.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TradeRequestDTO {

    @NotNull(message = "Stock ticker is required")
    @Size(min = 1, message = "Stock ticker cannot be empty")
    private String stockTicker;

    @NotNull(message = "Plan date is required")
    private String planDate;

    @NotNull(message = "Time frame is required")
    private String timeFrame;

    private String tradePlan;

    public TradeRequestDTO() {}

    public TradeRequestDTO(String stockTicker, String planDate, String timeFrame, String tradePlan) {
        this.stockTicker = stockTicker;
        this.planDate = planDate;
        this.timeFrame = timeFrame;
        this.tradePlan = tradePlan;
    }

    public String getStockTicker() {
        return stockTicker;
    }

    public void setStockTicker(String stockTicker) {
        this.stockTicker = stockTicker;
    }

    public String getPlanDate() {
        return planDate;
    }

    public void setPlanDate(String planDate) {
        this.planDate = planDate;
    }

    public String getTimeFrame() {
        return timeFrame;
    }

    public void setTimeFrame(String timeFrame) {
        this.timeFrame = timeFrame;
    }

    public String getTradePlan() {
        return tradePlan;
    }

    public void setTradePlan(String tradePlan) {
        this.tradePlan = tradePlan;
    }
}
