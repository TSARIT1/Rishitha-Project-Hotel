package com.reshitha.backend.service;

import com.reshitha.backend.dto.ReportData;
import com.reshitha.backend.model.InventoryItem;
import com.reshitha.backend.model.Order;
import com.reshitha.backend.model.OrderItem;
import com.reshitha.backend.repository.OrderRepository;
import com.reshitha.backend.repository.UserRepository;
import com.reshitha.backend.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Override
    public ReportData getReportData(int year, int month) {
        ReportData data = new ReportData();

        // 1. Determine Date Range
        // Ensure month is 1-12
        if (month < 1)
            month = 1;
        if (month > 12)
            month = 12;

        LocalDateTime startDate = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endDate = startDate.plusMonths(1);
        LocalDateTime now = LocalDateTime.now();

        List<Order> allOrders = orderRepository.findAll();

        // Filter orders within specific month
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> o.getOrderTime() != null &&
                        !o.getOrderTime().isBefore(startDate) &&
                        o.getOrderTime().isBefore(endDate))
                .collect(Collectors.toList());

        // 2. Calculate Revenue & Avg Order
        double totalRevenue = filteredOrders.stream().mapToDouble(Order::getTotalAmount).sum();
        data.setTotalRevenue(totalRevenue);
        data.setTotalRevenueGrowth(12.5); // Mock growth for now, or calculate vs previous period

        double avgOrder = filteredOrders.isEmpty() ? 0 : totalRevenue / filteredOrders.size();
        data.setAvgOrderValue(Math.round(avgOrder * 100.0) / 100.0);
        data.setAvgOrderGrowth(4.2); // Mock

        // 3. Customer Stats
        long totalCustomers = userRepository.count();
        data.setTotalCustomers(totalCustomers);
        data.setCustomerGrowth(8.1); // Mock

        // 4. Inventory Turn (Simplified: Total Revenue / Total Items count)
        long totalInventoryItems = inventoryItemRepository.count();
        double invTurn = totalInventoryItems == 0 ? 0 : totalRevenue / totalInventoryItems; // Very rough proxy
        data.setInventoryTurnover(Math.round(invTurn * 100.0) / 100.0);

        // 5. Revenue & Orders Trend (Group by Date)
        Map<String, Double> revenueTrend = new LinkedHashMap<>();
        Map<String, Long> ordersTrend = new LinkedHashMap<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd");

        // Initialize map with empty values for the range to ensure continuity
        LocalDateTime current = startDate;
        while (current.isBefore(endDate)) {
            String dateKey = current.format(dateFormatter);
            revenueTrend.put(dateKey, 0.0);
            ordersTrend.put(dateKey, 0L);
            current = current.plusDays(1);
        }

        // Fill with data
        for (Order order : filteredOrders) {
            String dateKey = order.getOrderTime().format(dateFormatter);
            revenueTrend.put(dateKey, revenueTrend.getOrDefault(dateKey, 0.0) + order.getTotalAmount());
            ordersTrend.put(dateKey, ordersTrend.getOrDefault(dateKey, 0L) + 1);
        }
        data.setRevenueTrend(revenueTrend);
        data.setOrdersTrend(ordersTrend);

        // 6. Sales by Category
        Map<String, Double> categorySales = new HashMap<>();
        for (Order order : filteredOrders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    String category = "Food & Dining"; // Default
                    if (item.getMenuItem() != null && item.getMenuItem().getCategory() != null) {
                        category = item.getMenuItem().getCategory();
                    }
                    // Aggregate revenue or count? Let's do revenue share
                    double itemTotal = item.getPriceAtOrder() * item.getQuantity();
                    categorySales.put(category, categorySales.getOrDefault(category, 0.0) + itemTotal);
                }
            }
        }
        // Convert to percentage? Frontend expects values for Doughnut, so raw values
        // are fine.
        data.setSalesByCategory(categorySales);

        // 7. Peak Dining Hours
        Map<String, Long> peakHours = new LinkedHashMap<>();
        // Initialize common hours
        String[] hours = { "11 AM", "1 PM", "3 PM", "5 PM", "7 PM", "9 PM", "11 PM" };
        for (String h : hours)
            peakHours.put(h, 0L);

        for (Order order : filteredOrders) {
            int hour = order.getOrderTime().getHour();
            String label = formatHour(hour);
            if (peakHours.containsKey(label)) {
                peakHours.put(label, peakHours.get(label) + 1);
            }
        }
        data.setPeakDiningHours(peakHours);

        // 8. Summary Reports Calculations

        // 8a. Tax & Compliance: Sum of taxAmount
        double totalTax = filteredOrders.stream()
                .mapToDouble(o -> o.getTaxAmount() != null ? o.getTaxAmount() : 0.0)
                .sum();
        data.setTotalTaxCollected(Math.round(totalTax * 100.0) / 100.0);

        // 8b. Inventory Wastage: Items expiring this month
        // We need all inventory items first
        List<InventoryItem> allInventory = inventoryItemRepository.findAll();
        final int queryMonth = month;
        final int queryYear = year;
        double wastageValue = allInventory.stream()
                .filter(i -> i.getExpiryDate() != null &&
                        i.getExpiryDate().getYear() == queryYear &&
                        i.getExpiryDate().getMonthValue() == queryMonth)
                .mapToDouble(i -> i.getCurrentStock() * i.getUnitCost())
                .sum();
        data.setInventoryWastageValue(Math.round(wastageValue * 100.0) / 100.0);

        // 8c. Top Staff
        Map<String, Double> staffSales = new HashMap<>();
        for (Order o : filteredOrders) {
            if (o.getWaiterName() != null) {
                staffSales.put(o.getWaiterName(), staffSales.getOrDefault(o.getWaiterName(), 0.0) + o.getTotalAmount());
            }
        }
        String topStaff = "N/A";
        double maxSales = 0.0;
        for (Map.Entry<String, Double> entry : staffSales.entrySet()) {
            if (entry.getValue() > maxSales) {
                maxSales = entry.getValue();
                topStaff = entry.getKey();
            }
        }
        data.setTopStaffName(topStaff);
        data.setTopStaffSales(Math.round(maxSales * 100.0) / 100.0);

        // 8d. Customer Satisfaction (Mock for now)
        data.setCustomerSatisfactionScore(4.8);

        return data;
    }

    private String formatHour(int hour) {
        // Map 24h to the specific labels used in frontend for simplicity
        if (hour >= 11 && hour < 13)
            return "11 AM";
        if (hour >= 13 && hour < 15)
            return "1 PM";
        if (hour >= 15 && hour < 17)
            return "3 PM";
        if (hour >= 17 && hour < 19)
            return "5 PM";
        if (hour >= 19 && hour < 21)
            return "7 PM";
        if (hour >= 21 && hour < 23)
            return "9 PM";
        if (hour >= 23 || hour < 1)
            return "11 PM";
        return "Other";
    }
}
