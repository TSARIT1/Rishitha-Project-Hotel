package com.reshitha.backend.repository;

import com.reshitha.backend.model.DiningTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiningTableRepository extends JpaRepository<DiningTable, Long> {
    Optional<DiningTable> findByTableNo(Integer tableNo);

    long countByStatus(String status);
}
