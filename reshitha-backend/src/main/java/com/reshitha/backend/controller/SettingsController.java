package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.RestaurantSettings;
import com.reshitha.backend.repository.RestaurantSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private RestaurantSettingsRepository settingsRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<RestaurantSettings>> getSettings() {
        List<RestaurantSettings> allSettings = settingsRepository.findAll();
        RestaurantSettings settings;

        if (allSettings.isEmpty()) {
            // Initialize default settings if none exist
            settings = new RestaurantSettings();
            settings.setRestaurantName("Rishitha Restaurant & Hotel");
            settings.setCurrency("Indian Rupee (INR)");
            settings.setTaxCgst(6.0);
            settings.setTaxSgst(6.0);
            settings = settingsRepository.save(settings);
        } else {
            settings = allSettings.get(0);
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Settings fetched successfully", settings));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<RestaurantSettings>> updateSettings(
            @RequestBody RestaurantSettings updatedSettings) {
        List<RestaurantSettings> allSettings = settingsRepository.findAll();
        RestaurantSettings settings;

        if (allSettings.isEmpty()) {
            settings = new RestaurantSettings();
        } else {
            settings = allSettings.get(0);
        }

        settings.setRestaurantName(updatedSettings.getRestaurantName());
        settings.setPhoneNumber(updatedSettings.getPhoneNumber());
        settings.setWebsiteUrl(updatedSettings.getWebsiteUrl());
        settings.setAddress(updatedSettings.getAddress());
        settings.setGstNumber(updatedSettings.getGstNumber());
        settings.setCurrency(updatedSettings.getCurrency());
        settings.setTaxCgst(updatedSettings.getTaxCgst());
        settings.setTaxSgst(updatedSettings.getTaxSgst());

        settings = settingsRepository.save(settings);

        return ResponseEntity.ok(new ApiResponse<>(true, "Settings updated successfully", settings));
    }
}
