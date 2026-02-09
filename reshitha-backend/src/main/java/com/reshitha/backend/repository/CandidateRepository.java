package com.reshitha.backend.repository;

import com.reshitha.backend.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByJobTitle(String jobTitle);

    List<Candidate> findByEmail(String email);
}
