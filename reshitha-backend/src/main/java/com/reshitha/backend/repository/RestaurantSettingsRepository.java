package com.reshitha.backend.repository;

import com.reshitha.backend.model.RestaurantSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantSettingsRepository extends JpaRepository<RestaurantSettings, Long> {
}
