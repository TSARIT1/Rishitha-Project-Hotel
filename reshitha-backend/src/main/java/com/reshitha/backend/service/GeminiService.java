package com.reshitha.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reshitha.backend.dto.ReportData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public String generateAnalysis(ReportData data) {
        try {
            // 1. Prepare Prompt Data
            Map<String, Object> promptData = new HashMap<>();
            promptData.put("totalRevenue", data.getTotalRevenue());
            promptData.put("totalCustomers", data.getTotalCustomers());
            promptData.put("topSellingCategory", getTopCategory(data.getSalesByCategory()));
            promptData.put("revenueTrend", data.getRevenueTrend());

            ObjectMapper mapper = new ObjectMapper();
            String jsonStats = mapper.writeValueAsString(promptData);

            // 2. Construct Request Payload
            String promptText = "You are a Senior Restaurant Consultant. Analyze this monthly performance data: "
                    + jsonStats +
                    ". Provide a concise executive summary in Markdown with: " +
                    "1. \uD83D\uDCC8 **Key Achievement**, " +
                    "2. \u26A0\uFE0F **Area for Improvement**, " +
                    "3. \uD83D\uDE80 **Strategic Recommendation** for next month. Keep it under 150 words.";

            Map<String, Object> contentPart = new HashMap<>();
            contentPart.put("text", promptText);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", Collections.singletonList(contentPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(parts));

            // 3. Make API Call
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = API_URL + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // 4. Parse Response
            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> responseParts = (List<Map<String, Object>>) content.get("parts");
                    return (String) responseParts.get(0).get("text");
                }
            }
            return "Unable to generate insight at this time.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating AI analysis: " + e.getMessage();
        }
    }

    private String getTopCategory(Map<String, Double> sales) {
        if (sales == null || sales.isEmpty())
            return "N/A";
        return sales.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
    }

    public String generateChatResponse(String userMessage, Map<String, Object> contextData) {
        try {
            // 1. Prepare Context
            ObjectMapper mapper = new ObjectMapper();
            String jsonContext = mapper.writeValueAsString(contextData);

            // 2. Construct Prompt
            String promptText = "You are a helpful AI Assistant for a Restaurant Manager. " +
                    "Here is the current operational data: " + jsonContext + ". " +
                    "User asks: \"" + userMessage + "\". " +
                    "Answer the user's question based on the data. " +
                    "Be professional, concise, and use Markdown for formatting (bold/bullets). " +
                    "If the answer isn't in the data, say you don't know but offer general advice.";

            Map<String, Object> contentPart = new HashMap<>();
            contentPart.put("text", promptText);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", Collections.singletonList(contentPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(parts));

            // 3. Make API Call
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = API_URL + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // 4. Parse Response
            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> responseParts = (List<Map<String, Object>>) content.get("parts");
                    return (String) responseParts.get(0).get("text");
                }
            }
            return "I'm having trouble connecting to my brain right now.";

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            if (e.getStatusCode() == org.springframework.http.HttpStatus.TOO_MANY_REQUESTS) {
                return "⚠️ **Access Limit Reached**\n\nI'm currently overwhelmed with requests. As a free-tier AI, I need a moment to cool down.\n\nPlease try again in about **1 minute**.";
            }
            e.printStackTrace();
            return "Error: " + e.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
