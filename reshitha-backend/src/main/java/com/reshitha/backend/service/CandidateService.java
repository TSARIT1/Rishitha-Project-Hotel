package com.reshitha.backend.service;

import com.reshitha.backend.model.Candidate;
import com.reshitha.backend.repository.CandidateRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final Path fileStorageLocation;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
        // Store in a 'uploads/resumes' directory in the project root
        this.fileStorageLocation = Paths.get("uploads/resumes").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Candidate applyJob(String fullName, String email, String phone, String education,
            String address, String jobTitle, MultipartFile resume) {

        String fileName = StringUtils.cleanPath(resume.getOriginalFilename());
        String storedFileName = "resume_" + UUID.randomUUID() + "_" + fileName;

        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(resume.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Candidate candidate = new Candidate();
            candidate.setFullName(fullName);
            candidate.setEmail(email);
            candidate.setPhone(phone);
            candidate.setEducation(education);
            candidate.setAddress(address);
            candidate.setJobTitle(jobTitle);
            candidate.setResumePath(storedFileName); // Store relative path or filename

            return candidateRepository.save(candidate);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }
}
