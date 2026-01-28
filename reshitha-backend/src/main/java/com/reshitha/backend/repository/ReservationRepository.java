package com.reshitha.backend.repository;

import com.reshitha.backend.model.Reservation;
import com.reshitha.backend.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByDate(LocalDate date);

    List<Reservation> findByStatus(ReservationStatus status);
}
