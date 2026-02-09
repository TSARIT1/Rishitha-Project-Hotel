package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.User;
import com.reshitha.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Define upload directory
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public UserController() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(@RequestParam(required = false) String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        if ((currentUsername == null || currentUsername.equals("anonymousUser")) && username != null) {
            currentUsername = username;
        }

        Optional<User> userOpt = userRepository.findByUsername(currentUsername);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(currentUsername);
        }

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", userOpt.get()));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found", null));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody User updatedUser,
            @RequestParam(required = false) String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        if ((currentUsername == null || currentUsername.equals("anonymousUser")) && username != null) {
            currentUsername = username;
        }

        Optional<User> userOpt = userRepository.findByUsername(currentUsername);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(currentUsername);
        }

        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();
            existingUser.setFullName(updatedUser.getFullName());
            existingUser.setLanguage(updatedUser.getLanguage());
            existingUser.setTimezone(updatedUser.getTimezone());

            // Notifications
            existingUser.setAlertReservation(updatedUser.isAlertReservation());
            existingUser.setAlertInventory(updatedUser.isAlertInventory());
            existingUser.setAlertRevenue(updatedUser.isAlertRevenue());
            existingUser.setAlertOrders(updatedUser.isAlertOrders());

            // Don't update email/username/password/role here directly unless needed
            // If email changes, it might invalidate the token if token is based on email

            userRepository.save(existingUser);
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", existingUser));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found", null));
        }
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<ApiResponse<String>> uploadPhoto(@RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        if ((currentUsername == null || currentUsername.equals("anonymousUser")) && username != null) {
            currentUsername = username;
        }

        Optional<User> userOpt = userRepository.findByUsername(currentUsername);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(currentUsername);
        }

        if (userOpt.isPresent()) {
            try {
                // Normalize file name
                String originalFileName = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                }

                String fileName = "profile_" + userOpt.get().getId() + "_" + UUID.randomUUID() + fileExtension;

                // Copy file to the target location (Replacing existing file with the same name)
                Path targetLocation = this.fileStorageLocation.resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                // Update user profile picture URL
                // In a real app, this would be a full URL. here we return the filename
                // which the frontend can access via static resource handler
                String fileUrl = "/uploads/" + fileName;
                User user = userOpt.get();
                user.setProfilePicture(fileUrl);
                userRepository.save(user);

                return ResponseEntity.ok(new ApiResponse<>(true, "Photo uploaded successfully", fileUrl));

            } catch (IOException ex) {
                return ResponseEntity.status(500)
                        .body(new ApiResponse<>(false, "Could not upload file: " + ex.getMessage(), null));
            }
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found", null));
        }
    }
}
