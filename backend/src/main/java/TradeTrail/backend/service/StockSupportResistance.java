package TradeTrail.backend.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class StockSupportResistance {
    private final String financeApiKey;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public StockSupportResistance(@Value("${FINANCE_MODEL_API_KEY}") String financeApiKey) {

        if (financeApiKey == null || financeApiKey.isBlank()) {
            throw new IllegalStateException("FINANCE_MODEL_API_KEY is not set in environment variables");
        }
        this.financeApiKey = financeApiKey;
    }


        public Map<String, String> getIndicators (String stockName){
            if (stockName == null || stockName.isBlank()) {
                throw new IllegalArgumentException("Stock name cannot be null or empty.");
            }

            String apiUrl = String.format(
                    "https://financialmodelingprep.com/api/v3/historical-price-full/%s?apikey=%s",
                    stockName.toUpperCase(), financeApiKey
            );

            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(apiUrl))
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() != 200) {
                    throw new RuntimeException("Failed to fetch market data. HTTP code: " + response.statusCode());
                }

                JsonNode root = objectMapper.readTree(response.body());
                JsonNode historical = root.path("historical");

                if (!historical.isArray() || historical.isEmpty()) {
                    throw new RuntimeException("No historical data found for stock: " + stockName);
                }

                JsonNode latest = historical.get(0);
                String dateString = latest.has("date")
                        ? latest.get("date").asText()
                        : latest.has("datetime")
                        ? latest.get("datetime").asText()
                        : null;

                Date planDate = null;

                if (dateString != null) {
                    try {
                        // If datetime like "2025-08-01T15:00:00", take only the date part
                        String onlyDate = dateString.split("T")[0];

                        // Parse to LocalDate
                        LocalDate localDate = LocalDate.parse(onlyDate, DateTimeFormatter.ISO_LOCAL_DATE);

                        // Convert to java.util.Date with time set to 00:00:00
                        planDate = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

                    } catch (Exception e) {
                        throw new RuntimeException("Invalid date format in JSON: " + dateString);
                    }
                }
                double high = latest.has("high") ? latest.get("high").asDouble() : 0.0;
                double low = latest.has("low") ? latest.get("low").asDouble() : 0.0;
                double close = latest.has("close") ? latest.get("close").asDouble() : 0.0;
                double vwap = latest.has("vwap") ? latest.get("vwap").asDouble() : (high + low + close) / 3;

                Map<String, String> indicators = new HashMap<>();
                indicators.put("vwap", String.format("%.2f", vwap));
                indicators.put("support", String.format("%.2f", low));
                indicators.put("resistance", String.format("%.2f", high));
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(planDate);
                indicators.put("planDate", formattedDate);

                return indicators;

            } catch (IOException | InterruptedException e) {
                throw new RuntimeException("Error fetching or parsing market data", e);
            }
        }
    }


