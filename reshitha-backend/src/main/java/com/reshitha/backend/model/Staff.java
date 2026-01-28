package com.reshitha.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "staff")
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String staffId; // e.g., ST-001

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    private String status; // Active, On Leave
    private String shifts;
    private String salary;
    private String attendance; // e.g., 98%
    private String performance; // excellent, good, average

    public Staff() {
    }

    @PrePersist
    public void generateStaffId() {
        // Simple logic to generate ID if not present (this is a placeholder, strictly
        // speaking should be improved)
        if (this.staffId == null) {
            this.staffId = "ST-" + System.currentTimeMillis(); // Temporary unique ID
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShifts() {
        return shifts;
    }

    public void setShifts(String shifts) {
        this.shifts = shifts;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getAttendance() {
        return attendance;
    }

    public void setAttendance(String attendance) {
        this.attendance = attendance;
    }

    public String getPerformance() {
        return performance;
    }

    public void setPerformance(String performance) {
        this.performance = performance;
    }
}
