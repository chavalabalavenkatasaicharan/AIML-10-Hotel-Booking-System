package com.bellhaven.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bellhaven.backend.model.User;
import com.bellhaven.backend.repository.UserRepository;

/**
 * Seeds one ADMIN account on startup, if it doesn't already exist.
 * Done here (in Java) rather than in data.sql because data.sql runs
 * before we have a PasswordEncoder bean available, and we don't want
 * a plaintext password sitting in a SQL file.
 *
 * Login with: admin@bellhaven.in / admin123
 */
@Configuration
public class AdminSeeder {

    @Bean
    public CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@bellhaven.in";
            if (!userRepository.existsByEmailIgnoreCase(adminEmail)) {
                User admin = new User();
                admin.setFullName("Bellhaven Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
            }
        };
    }
}