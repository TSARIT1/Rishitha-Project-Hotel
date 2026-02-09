package com.reshitha.backend.config;

import com.reshitha.backend.model.Role;
import com.reshitha.backend.model.User;
import com.reshitha.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists
        if (userRepository.count() == 0) {
            System.out.println("Seeding default users...");

            // Create Admin
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@rishitha.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole(Role.ADMIN);
            admin.setFullName("Admin User");
            userRepository.save(admin);

            // Create Staff
            User staff = new User();
            staff.setUsername("staff");
            staff.setEmail("staff@rishitha.com");
            staff.setPassword(passwordEncoder.encode("password123"));
            staff.setRole(Role.STAFF);
            staff.setFullName("Staff Member");
            userRepository.save(staff);

            // Create User
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@rishitha.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(Role.USER);
            user.setFullName("Regular User");
            userRepository.save(user);

            System.out.println("Default users seeded: admin/password123, staff/password123");
        }

        // Explicitly create a new admin if requested (recover access)
        if (!userRepository.existsByUsername("dighesaurabh46@gmail.com")) {
            User newAdmin = new User();
            newAdmin.setUsername("dighesaurabh46@gmail.com");
            newAdmin.setEmail("dighesaurabh46@gmail.com");
            newAdmin.setPassword(passwordEncoder.encode("admin123"));
            newAdmin.setRole(Role.ADMIN);
            newAdmin.setFullName("Saurabh Dighe");
            userRepository.save(newAdmin);
            System.out.println("Seeded recovery user: dighesaurabh46@gmail.com/admin123");
        }
    }
}
