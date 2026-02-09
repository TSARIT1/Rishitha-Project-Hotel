package com.reshitha.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String phone;

    @Column(length = 1000)
    private String education;

    @Column(length = 1000)
    private String address;

    private String resumePath;
    private String jobTitle; // The job they are applying for

    private String status; // Applied, Shortlisted, Rejected
    private LocalDateTime appliedDate;

    public Candidate() {
        this.appliedDate = LocalDateTime.now();
        this.status = "Applied";
    }

    public Candidate(String fullName, String email, String phone, String education, String address, String resumePath,
            String jobTitle) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.education = education;
        this.address = address;
        this.resumePath = resumePath;
        this.jobTitle = jobTitle;
        this.status = "Applied";
        this.appliedDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }
}
