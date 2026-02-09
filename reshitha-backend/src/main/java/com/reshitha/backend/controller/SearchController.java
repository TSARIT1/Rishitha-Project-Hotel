package com.reshitha.backend.controller;

import com.reshitha.backend.dto.GlobalSearchResponse;
import com.reshitha.backend.model.Customer;
import com.reshitha.backend.model.MenuItem;
import com.reshitha.backend.model.Order;
import com.reshitha.backend.repository.CustomerRepository;
import com.reshitha.backend.repository.MenuItemRepository;
import com.reshitha.backend.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    private final MenuItemRepository menuItemRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public SearchController(MenuItemRepository menuItemRepository, CustomerRepository customerRepository,
            OrderRepository orderRepository) {
        this.menuItemRepository = menuItemRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<GlobalSearchResponse> search(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(new GlobalSearchResponse(Collections.emptyList(), Collections.emptyList(),
                    Collections.emptyList()));
        }

        String searchTerm = query.trim();

        List<MenuItem> menuItems = menuItemRepository.findByNameContainingIgnoreCase(searchTerm);
        List<Customer> customers = customerRepository.findByNameContainingIgnoreCaseOrContactContaining(searchTerm,
                searchTerm);
        List<Order> orders = orderRepository.findByCustomerNameContainingIgnoreCase(searchTerm);

        return ResponseEntity.ok(new GlobalSearchResponse(menuItems, customers, orders));
    }
}
