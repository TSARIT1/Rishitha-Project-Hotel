package com.reshitha.backend.service;

import com.reshitha.backend.dto.DashboardStats;
import com.reshitha.backend.model.InventoryItem;
import com.reshitha.backend.model.OrderStatus;
import com.reshitha.backend.repository.InventoryItemRepository;
import com.reshitha.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final com.reshitha.backend.repository.DiningTableRepository diningTableRepository;

    @Autowired
    public DashboardService(OrderRepository orderRepository, InventoryItemRepository inventoryItemRepository,
            com.reshitha.backend.repository.DiningTableRepository diningTableRepository) {
        this.orderRepository = orderRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.diningTableRepository = diningTableRepository;
    }

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();

        // Active Orders (PENDING + PREPARING + READY)
        long activeCount = orderRepository.countByStatus(OrderStatus.PENDING) +
                orderRepository.countByStatus(OrderStatus.PREPARING) +
                orderRepository.countByStatus(OrderStatus.READY);
        stats.setActiveOrders(activeCount);

        // Inventory Stats
        List<InventoryItem> lowStock = inventoryItemRepository.findByStatus("Low Stock");
        stats.setLowStockItems((long) lowStock.size());
        stats.setTotalInventoryItems(inventoryItemRepository.count());

        // Table Stats
        stats.setTotalTables(diningTableRepository.count());
        stats.setOccupiedTables(diningTableRepository.countByStatus("Occupied"));

        // Revenue Stats
        Double totalRev = orderRepository.sumTotalRevenue();
        stats.setTotalRevenue(totalRev != null ? totalRev : 0.0);

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        Double todayRev = orderRepository.sumRevenueBetween(todayStart, todayEnd);
        stats.setTodayRevenue(todayRev != null ? todayRev : 0.0);

        // Mock Chart Data (Real implementation would require complex Group By queries)
        Map<String, Double> revenueChart = new HashMap<>();
        revenueChart.put("Mon", 1200.0);
        revenueChart.put("Tue", 1500.0);
        stats.setRevenueLast7Days(revenueChart);

        return stats;
    }
}
