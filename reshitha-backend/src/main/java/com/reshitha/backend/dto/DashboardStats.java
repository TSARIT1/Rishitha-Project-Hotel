package com.reshitha.backend.dto;

import java.util.Map;

public class DashboardStats {
    private Long activeOrders;
    private Long lowStockItems;
    private Double todayRevenue;
    private Double totalRevenue;
    private Long totalInventoryItems;
    private Long totalTables;
    private Long occupiedTables;

    // Additional fields for charts
    private Map<String, Double> revenueLast7Days;
    private Map<String, Long> salesByCategory;

    // Getters and Setters

    public Long getActiveOrders() {
        return activeOrders;
    }

    public void setActiveOrders(Long activeOrders) {
        this.activeOrders = activeOrders;
    }

    public Long getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(Long lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public Double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(Double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalInventoryItems() {
        return totalInventoryItems;
    }

    public void setTotalInventoryItems(Long totalInventoryItems) {
        this.totalInventoryItems = totalInventoryItems;
    }

    public Long getTotalTables() {
        return totalTables;
    }

    public void setTotalTables(Long totalTables) {
        this.totalTables = totalTables;
    }

    public Long getOccupiedTables() {
        return occupiedTables;
    }

    public void setOccupiedTables(Long occupiedTables) {
        this.occupiedTables = occupiedTables;
    }

    public Map<String, Double> getRevenueLast7Days() {
        return revenueLast7Days;
    }

    public void setRevenueLast7Days(Map<String, Double> revenueLast7Days) {
        this.revenueLast7Days = revenueLast7Days;
    }

    public Map<String, Long> getSalesByCategory() {
        return salesByCategory;
    }

    public void setSalesByCategory(Map<String, Long> salesByCategory) {
        this.salesByCategory = salesByCategory;
    }
}
