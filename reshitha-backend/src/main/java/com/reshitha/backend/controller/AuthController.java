package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.dto.JwtResponse;
import com.reshitha.backend.dto.LoginRequest;
import com.reshitha.backend.dto.RegisterRequest;
import com.reshitha.backend.model.Role;
import com.reshitha.backend.model.User;
import com.reshitha.backend.repository.UserRepository;
import com.reshitha.backend.security.JwtUtils;
import com.reshitha.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Error: Username is already taken!", null));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Error: Email is already in use!", null));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                Role.USER); // Default to USER

        if (signUpRequest.getRole() != null) {
            try {
                user.setRole(Role.valueOf(signUpRequest.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // default to user if invalid
                user.setRole(Role.USER);
            }
        } else {
            user.setRole(Role.USER);
        }

        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully!", user));
    }

    @Autowired
    com.reshitha.backend.service.OtpService otpService;

    @Autowired
    com.reshitha.backend.service.EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        if (email == null || !userRepository.existsByEmail(email)) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Error: Email not found!", null));
        }

        String otp = otpService.generateOtp(email);
        emailService.sendSimpleMessage(email, "Password Reset OTP", "Your OTP for password reset is: " + otp);

        return ResponseEntity.ok(new ApiResponse<>(true, "OTP sent to email!", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || otp == null || newPassword == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Error: Missing fields!", null));
        }

        if (!otpService.validateOtp(email, otp)) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Error: Invalid or expired OTP!", null));
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successfully!", null));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Token is valid", null));
    }
}
