package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.dto.ReportData;
import com.reshitha.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private com.reshitha.backend.service.GeminiService geminiService;

    @GetMapping
    public ResponseEntity<ApiResponse<ReportData>> getReports(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        // Defaults to current date if not provided
        java.time.LocalDate now = java.time.LocalDate.now();
        if (year == null)
            year = now.getYear();
        if (month == null)
            month = now.getMonthValue();

        ReportData data = reportService.getReportData(year, month);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports fetched successfully", data));
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<String>> analyzeReport(@RequestBody ReportData reportData) {
        String analysis = geminiService.generateAnalysis(reportData);
        return ResponseEntity.ok(new ApiResponse<>(true, "Analysis generated", analysis));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chatWithAI(@RequestBody java.util.Map<String, Object> payload) {
        try {
            String message = (String) payload.get("message");
            Object contextObj = payload.get("context");
            java.util.Map<String, Object> context;

            if (contextObj instanceof java.util.Map) {
                context = (java.util.Map<String, Object>) contextObj;
            } else {
                context = new java.util.HashMap<>();
                context.put("data", contextObj);
            }

            String response = geminiService.generateChatResponse(message, context);
            return ResponseEntity.ok(new ApiResponse<>(true, "Response generated", response));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse<>(false, "Server Error: " + e.getMessage(),
                    "I encountered an error processing your request."));
        }
    }
}
