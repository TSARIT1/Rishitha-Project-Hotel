package com.reshitha.backend.service;

import com.reshitha.backend.model.Job;
import com.reshitha.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public List<Job> getActiveJobs() {
        return jobRepository.findByStatus("Active");
    }

    @Override
    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    @Override
    public Job createJob(Job job) {
        if (job.getStatus() == null) {
            job.setStatus("Active");
        }
        if (job.getPostedDate() == null) {
            job.setPostedDate(java.time.LocalDate.now().toString());
        }
        if (job.getApplicants() == null) {
            job.setApplicants(0);
        }
        return jobRepository.save(job);
    }

    @Override
    public Job updateJob(Long id, Job jobDetails) {
        Optional<Job> job = jobRepository.findById(id);
        if (job.isPresent()) {
            Job existingJob = job.get();
            existingJob.setTitle(jobDetails.getTitle());
            existingJob.setDepartment(jobDetails.getDepartment());
            existingJob.setType(jobDetails.getType());
            existingJob.setLocation(jobDetails.getLocation());
            existingJob.setSalary(jobDetails.getSalary());
            existingJob.setDescription(jobDetails.getDescription());
            existingJob.setStatus(jobDetails.getStatus());
            return jobRepository.save(existingJob);
        }
        return null;
    }

    @Override
    public Job updateJobStatus(Long id, String status) {
        Optional<Job> job = jobRepository.findById(id);
        if (job.isPresent()) {
            Job existingJob = job.get();
            existingJob.setStatus(status);
            return jobRepository.save(existingJob);
        }
        return null;
    }

    @Override
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
