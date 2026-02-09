package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.Candidate;
import com.reshitha.backend.service.CandidateService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Candidate>> applyForJob(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("education") String education,
            @RequestParam("address") String address,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("resume") MultipartFile resume) {

        try {
            Candidate savedCandidate = candidateService.applyJob(fullName, email, phone, education, address, jobTitle,
                    resume);
            return ResponseEntity.ok(new ApiResponse<>(true, "Application submitted successfully!", savedCandidate));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to submit application: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Candidate>>> getAllCandidates() {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Candidates fetched successfully", candidateService.getAllCandidates()));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads/resumes").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
