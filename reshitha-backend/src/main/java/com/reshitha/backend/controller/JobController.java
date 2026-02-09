package com.reshitha.backend.controller;

import com.reshitha.backend.model.Job;
import com.reshitha.backend.service.JobService;
import com.reshitha.backend.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*") // Allow frontend to access
public class JobController {

    @Autowired
    private JobService jobService;

    // GET all jobs (Admin view using this, but filter by status in UI if needed)
    @GetMapping
    public ResponseEntity<ApiResponse> getAllJobs() {
        System.out.println("Processing GET /api/jobs");
        try {
            List<Job> jobs = jobService.getAllJobs();
            System.out.println("Fetched " + jobs.size() + " jobs");
            return ResponseEntity.ok(new ApiResponse(true, "Jobs data fetched successfully", jobs));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error: " + e.getMessage(), null));
        }
    }

    // GET active jobs (Landing page uses this)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse> getActiveJobs() {
        List<Job> jobs = jobService.getActiveJobs();
        return ResponseEntity.ok(new ApiResponse(true, "Active jobs fetched successfully", jobs));
    }

    // POST create job
    @PostMapping
    public ResponseEntity<ApiResponse> createJob(@RequestBody com.reshitha.backend.dto.JobRequest request) {
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDepartment(request.getDepartment());
        job.setType(request.getType());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setDescription(request.getDescription());
        job.setStatus(request.getStatus());

        // Let service handle rest (applicants, postedDate)
        Job savedJob = jobService.createJob(job);
        return ResponseEntity.ok(new ApiResponse(true, "Job posted successfully", savedJob));
    }

    // PUT update job
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateJob(@PathVariable Long id, @RequestBody Job job) {
        Job updatedJob = jobService.updateJob(id, job);
        if (updatedJob != null) {
            return ResponseEntity.ok(new ApiResponse(true, "Job updated successfully", updatedJob));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Job not found", null));
        }
    }

    // PUT update status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Job updatedJob = jobService.updateJobStatus(id, status);
        if (updatedJob != null) {
            return ResponseEntity.ok(new ApiResponse(true, "Job status updated", updatedJob));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Job not found", null));
        }
    }

    // DELETE job
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(new ApiResponse(true, "Job deleted successfully", null));
    }
}
