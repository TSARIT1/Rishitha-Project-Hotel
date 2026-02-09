package com.reshitha.backend.service;

import com.reshitha.backend.model.Customer;
import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();

    Customer createCustomer(Customer customer);

    Customer updateCustomer(Long id, Customer customer);

    void deleteCustomer(Long id);
}
