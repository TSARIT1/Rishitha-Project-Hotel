package com.reshitha.backend.repository;

import com.reshitha.backend.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByCategory(String category);

    List<Supplier> findByStatus(String status);
}
