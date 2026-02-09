package com.reshitha.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerId; // e.g., C001
    private String name;
    private String email;
    private String contact;
    private String type; // VIP, Regular, New
    private int visits;
    private double spending;
    private LocalDate lastVisit;
    private int preferredTable;
    private int loyaltyPoints;

    public Customer() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getVisits() {
        return visits;
    }

    public void setVisits(int visits) {
        this.visits = visits;
    }

    public double getSpending() {
        return spending;
    }

    public void setSpending(double spending) {
        this.spending = spending;
    }

    public LocalDate getLastVisit() {
        return lastVisit;
    }

    public void setLastVisit(LocalDate lastVisit) {
        this.lastVisit = lastVisit;
    }

    public int getPreferredTable() {
        return preferredTable;
    }

    public void setPreferredTable(int preferredTable) {
        this.preferredTable = preferredTable;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }
}
