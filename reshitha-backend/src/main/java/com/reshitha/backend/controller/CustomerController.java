package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.Customer;
import com.reshitha.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched all customers", customerService.getAllCustomers()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Customer created successfully", customerService.createCustomer(customer)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Customer updated successfully", customerService.updateCustomer(id, customer)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Customer deleted successfully", null));
    }
}
