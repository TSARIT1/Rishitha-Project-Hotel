package com.reshitha.backend.repository;

import com.reshitha.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerId(String customerId);

    List<Customer> findByNameContainingIgnoreCaseOrContactContaining(String name, String contact);
}
