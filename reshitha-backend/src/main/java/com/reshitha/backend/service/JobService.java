package com.reshitha.backend.service;

import com.reshitha.backend.model.Job;
import java.util.List;
import java.util.Optional;

public interface JobService {
    List<Job> getAllJobs();

    List<Job> getActiveJobs();

    Optional<Job> getJobById(Long id);

    Job createJob(Job job);

    Job updateJob(Long id, Job jobDetails);

    Job updateJobStatus(Long id, String status);

    void deleteJob(Long id);
}
