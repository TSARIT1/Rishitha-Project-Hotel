package com.reshitha.backend.service;

import com.reshitha.backend.dto.LoginRequest;
import com.reshitha.backend.dto.RegisterRequest;
import com.reshitha.backend.model.Role;
import com.reshitha.backend.model.User;
import com.reshitha.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException | NullPointerException e) {
            user.setRole(Role.USER); // Default role
        }

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        System.out.println("Attempting login for: " + request.getUsernameOrEmail());
        Optional<User> userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        if (userOpt.isEmpty()) {
            System.out.println("User not found by username, trying email...");
            userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        }

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found!");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return user;
    }
}
