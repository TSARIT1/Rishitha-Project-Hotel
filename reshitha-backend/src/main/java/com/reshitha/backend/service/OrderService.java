package com.reshitha.backend.service;

import com.reshitha.backend.dto.OrderRequest;
import com.reshitha.backend.model.*;
import com.reshitha.backend.repository.MenuItemRepository;
import com.reshitha.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setTableNumber(request.getTableNumber());
        order.setCustomerName(request.getCustomerName());
        order.setWaiterName(request.getWaiterName());
        order.setStatus(OrderStatus.PENDING);
        order.setPriority("Normal"); // Default logic

        double totalAmount = 0.0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu Item not found: " + itemRequest.getMenuItemId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtOrder(menuItem.getPrice());

            order.addItem(orderItem);

            totalAmount += menuItem.getPrice() * itemRequest.getQuantity();
        }

        double taxRate = request.getTaxRate() != null ? request.getTaxRate() : 0.0;
        double taxAmount = totalAmount * (taxRate / 100.0);
        double finalAmount = totalAmount + taxAmount;

        order.setTaxRate(taxRate);
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(finalAmount);

        order.setTotalItemsCount(
                request.getItems().stream().mapToInt(OrderRequest.OrderItemRequest::getQuantity).sum());
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        return orderRepository.save(order);
    }
}
