package com.reshitha.backend.repository;

import com.reshitha.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(String status);
}
