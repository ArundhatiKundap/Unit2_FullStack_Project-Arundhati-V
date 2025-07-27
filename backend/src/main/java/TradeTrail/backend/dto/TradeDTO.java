package TradeTrail.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TradeDTO {

    @NotNull
    private long id;

    @NotBlank(message = "Date is required")
    private String tradeDate;

    @NotBlank(message = "Stock name is required")
    private String stockName;

    @NotNull
    private double entryPrice;

    @NotNull
    private double exitPrice;

    @NotBlank(message = "Trade type is required")
    private String tradeType;

    @NotNull
    private int quantity;

    @NotBlank(message ="instrument is required")
    private String instrument;

    private long traderId;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTradeDate() {
        return tradeDate;
    }

    public void setTradeDate(String tradeDate) {
        this.tradeDate = tradeDate;
    }

    public String getStockName(){
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public Double getEntryPrice() {
        return entryPrice;
    }

    public void setEntryPrice (Double entryPrice){
            this.entryPrice = entryPrice;
    }

        public Double getExitPrice () {
            return exitPrice;
        }

        public void setExitPrice (Double exitPrice){
            this.exitPrice = exitPrice;
        }

        public String getTradeType () {
            return tradeType;
        }

        public void setTradeType (String tradeType){
            this.tradeType = tradeType;
        }

        public int getQuantity () {
            return quantity;
        }

        public void setQuantity (int quantity){
            this.quantity = quantity;
        }
        public String getInstrument(){
           return instrument;
        }
        public void setInstrument(String instrument){
           this.instrument = instrument;
        }
        public Long getTraderId () {
            return traderId;
        }
        public void setTraderId (Long traderId){
          this.traderId = traderId;
    }

}
