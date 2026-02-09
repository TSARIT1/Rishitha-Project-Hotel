package com.reshitha.backend.dto;

import java.util.Map;

public class ReportData {
    private Double totalRevenue;
    private Double totalRevenueGrowth; // Percentage
    private Double avgOrderValue;
    private Double avgOrderGrowth; // Percentage
    private Long totalCustomers;
    private Double customerGrowth; // Percentage
    private Double inventoryTurnover;

    // Charts
    private Map<String, Double> revenueTrend;
    private Map<String, Long> ordersTrend;
    private Map<String, Double> salesByCategory;
    private Map<String, Long> peakDiningHours;

    // Summary Reports
    private Double totalTaxCollected;
    private Double inventoryWastageValue;
    private String topStaffName;
    private Double topStaffSales;
    private Double customerSatisfactionScore;

    public ReportData() {
    }

    // Getters and Setters
    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getTotalRevenueGrowth() {
        return totalRevenueGrowth;
    }

    public void setTotalRevenueGrowth(Double totalRevenueGrowth) {
        this.totalRevenueGrowth = totalRevenueGrowth;
    }

    public Double getAvgOrderValue() {
        return avgOrderValue;
    }

    public void setAvgOrderValue(Double avgOrderValue) {
        this.avgOrderValue = avgOrderValue;
    }

    public Double getAvgOrderGrowth() {
        return avgOrderGrowth;
    }

    public void setAvgOrderGrowth(Double avgOrderGrowth) {
        this.avgOrderGrowth = avgOrderGrowth;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Double getCustomerGrowth() {
        return customerGrowth;
    }

    public void setCustomerGrowth(Double customerGrowth) {
        this.customerGrowth = customerGrowth;
    }

    public Double getInventoryTurnover() {
        return inventoryTurnover;
    }

    public void setInventoryTurnover(Double inventoryTurnover) {
        this.inventoryTurnover = inventoryTurnover;
    }

    public Map<String, Double> getRevenueTrend() {
        return revenueTrend;
    }

    public void setRevenueTrend(Map<String, Double> revenueTrend) {
        this.revenueTrend = revenueTrend;
    }

    public Map<String, Long> getOrdersTrend() {
        return ordersTrend;
    }

    public void setOrdersTrend(Map<String, Long> ordersTrend) {
        this.ordersTrend = ordersTrend;
    }

    public Map<String, Double> getSalesByCategory() {
        return salesByCategory;
    }

    public void setSalesByCategory(Map<String, Double> salesByCategory) {
        this.salesByCategory = salesByCategory;
    }

    public Map<String, Long> getPeakDiningHours() {
        return peakDiningHours;
    }

    public void setPeakDiningHours(Map<String, Long> peakDiningHours) {
        this.peakDiningHours = peakDiningHours;
    }

    public Double getTotalTaxCollected() {
        return totalTaxCollected;
    }

    public void setTotalTaxCollected(Double totalTaxCollected) {
        this.totalTaxCollected = totalTaxCollected;
    }

    public Double getInventoryWastageValue() {
        return inventoryWastageValue;
    }

    public void setInventoryWastageValue(Double inventoryWastageValue) {
        this.inventoryWastageValue = inventoryWastageValue;
    }

    public String getTopStaffName() {
        return topStaffName;
    }

    public void setTopStaffName(String topStaffName) {
        this.topStaffName = topStaffName;
    }

    public Double getTopStaffSales() {
        return topStaffSales;
    }

    public void setTopStaffSales(Double topStaffSales) {
        this.topStaffSales = topStaffSales;
    }

    public Double getCustomerSatisfactionScore() {
        return customerSatisfactionScore;
    }

    public void setCustomerSatisfactionScore(Double customerSatisfactionScore) {
        this.customerSatisfactionScore = customerSatisfactionScore;
    }
}
