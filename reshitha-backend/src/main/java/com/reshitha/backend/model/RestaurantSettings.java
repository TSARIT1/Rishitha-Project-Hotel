package com.reshitha.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurant_settings")
public class RestaurantSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Business Profile
    private String restaurantName;
    private String phoneNumber;
    private String websiteUrl;
    @Column(length = 500)
    private String address;
    private String gstNumber;

    // Financial & System Setup
    private String currency = "Indian Rupee (INR)";
    private double taxCgst = 6.0;
    private double taxSgst = 6.0;

    public RestaurantSettings() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public double getTaxCgst() {
        return taxCgst;
    }

    public void setTaxCgst(double taxCgst) {
        this.taxCgst = taxCgst;
    }

    public double getTaxSgst() {
        return taxSgst;
    }

    public void setTaxSgst(double taxSgst) {
        this.taxSgst = taxSgst;
    }
}
