package com.reshitha.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String fullName;
    private String profilePicture; // URL or path
    private String language = "English (US)";
    private String timezone = "GMT+05:30";

    // Notification Preferences
    @com.fasterxml.jackson.annotation.JsonProperty("alertReservation")
    private boolean alertReservation = true;
    @com.fasterxml.jackson.annotation.JsonProperty("alertInventory")
    private boolean alertInventory = true;
    @com.fasterxml.jackson.annotation.JsonProperty("alertRevenue")
    private boolean alertRevenue = true;
    @com.fasterxml.jackson.annotation.JsonProperty("alertOrders")
    private boolean alertOrders = true;

    public User() {
    }

    public User(String username, String email, String password, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean isAlertReservation() {
        return alertReservation;
    }

    public void setAlertReservation(boolean alertReservation) {
        this.alertReservation = alertReservation;
    }

    public boolean isAlertInventory() {
        return alertInventory;
    }

    public void setAlertInventory(boolean alertInventory) {
        this.alertInventory = alertInventory;
    }

    public boolean isAlertRevenue() {
        return alertRevenue;
    }

    public void setAlertRevenue(boolean alertRevenue) {
        this.alertRevenue = alertRevenue;
    }

    public boolean isAlertOrders() {
        return alertOrders;
    }

    public void setAlertOrders(boolean alertOrders) {
        this.alertOrders = alertOrders;
    }
}
