package com.reshitha.backend.repository;

import com.reshitha.backend.model.Order;
import com.reshitha.backend.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByTableNumber(Integer tableNumber);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double sumTotalRevenue();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderTime >= :startTime AND o.orderTime <= :endTime")
    Double sumRevenueBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    Long countByStatus(OrderStatus status);

    @Query("SELECT new map(m.category as category, SUM(oi.quantity) as count) FROM OrderItem oi JOIN oi.menuItem m GROUP BY m.category")
    List<java.util.Map<String, Object>> findSalesByCategory();

    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);
}
