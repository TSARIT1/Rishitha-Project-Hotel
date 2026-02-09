package com.reshitha.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String department;
    private String type; // Full Time, Part Time, etc.
    private String location;
    private String salary;

    @Column(length = 1000)
    private String description;

    @Column(name = "job_status")
    private String status; // Active, Closed, Draft
    private Integer applicants = 0;

    private String postedDate;

    public Job() {
        this.postedDate = java.time.LocalDate.now().toString();
        this.applicants = 0;
    }

    public Job(String title, String department, String type, String location, String salary, String description,
            String status) {
        this.title = title;
        this.department = department;
        this.type = type;
        this.location = location;
        this.salary = salary;
        this.description = description;
        this.status = status;
        this.applicants = 0;
        this.postedDate = java.time.LocalDate.now().toString();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getApplicants() {
        return applicants;
    }

    public void setApplicants(Integer applicants) {
        this.applicants = applicants;
    }

    public String getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(String postedDate) {
        this.postedDate = postedDate;
    }
}
