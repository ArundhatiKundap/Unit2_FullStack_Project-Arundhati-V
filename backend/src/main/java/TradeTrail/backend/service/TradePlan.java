package TradeTrail.backend.service;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TradePlan {

    private final Client geminiClient;
    private final StockSupportResistance stockSupportResistance;

    @Autowired
    public TradePlan(StockSupportResistance stockSupportResistance, @Value("${GEMINIAI_API_KEY}") String googleApiKey) {
        this.stockSupportResistance = stockSupportResistance;


        if (googleApiKey == null || googleApiKey.isBlank()) {
            throw new IllegalStateException("GEMINIAI_API_KEY is not set in environment variables");
        }

        this.geminiClient = Client.builder()
                .apiKey(googleApiKey)
                .build();
    }


    public String generateTradePlan(String stockName) {
        Map<String, String> indicators = stockSupportResistance.getIndicators(stockName);

        String prompt = String.format("""
                Generate a detailed intraday trade plan for %s as per EOD data of the  %s using :
                - VWAP: %s
                - Support: %s
                - Resistance: %s

                Please include:
                - Bias (long or short)
                - Entry and exit points
                - Stop loss level
                - Reasoning for the plan
                """,
                stockName.toUpperCase(),
                indicators.get("planDate"),
                indicators.get("vwap"),
                indicators.get("support"),
                indicators.get("resistance")

        );


        try {
            GenerateContentResponse response = geminiClient.models
                    .generateContent("gemini-1.5-flash", prompt, null);
            return response.text();
        } catch (Exception e) {
            e.printStackTrace();
            return "Could not generate trade plan.";
        }
    }
}

