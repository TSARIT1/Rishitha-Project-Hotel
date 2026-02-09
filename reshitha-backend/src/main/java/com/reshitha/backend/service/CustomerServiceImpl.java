package com.reshitha.backend.service;

import com.reshitha.backend.model.Customer;
import com.reshitha.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer createCustomer(Customer customer) {
        // If customerId is not provided, we could generate it here
        // For now, we trust the input or can simple auto-generate if null
        if (customer.getCustomerId() == null || customer.getCustomerId().isEmpty()) {
            customer.setCustomerId("C" + System.currentTimeMillis());
        }
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(updatedCustomer.getName());
            customer.setEmail(updatedCustomer.getEmail());
            customer.setContact(updatedCustomer.getContact());
            customer.setType(updatedCustomer.getType());
            customer.setPreferredTable(updatedCustomer.getPreferredTable());
            // Optionally update other stats if needed directly
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("Customer not found with id " + id));
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
