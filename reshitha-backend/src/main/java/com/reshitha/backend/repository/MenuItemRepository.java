package com.reshitha.backend.repository;

import com.reshitha.backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(String category);

    List<MenuItem> findByAvailableTrue();

    List<MenuItem> findByNameContainingIgnoreCase(String name);
}
