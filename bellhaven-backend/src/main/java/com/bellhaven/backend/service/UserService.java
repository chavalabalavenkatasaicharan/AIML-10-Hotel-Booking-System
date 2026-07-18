package com.bellhaven.backend.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bellhaven.backend.dto.AuthResponse;
import com.bellhaven.backend.dto.SigninRequest;
import com.bellhaven.backend.dto.SignupRequest;
import com.bellhaven.backend.exception.AuthValidationException;
import com.bellhaven.backend.model.User;
import com.bellhaven.backend.repository.UserRepository;

@Service
public class UserService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(SignupRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();

        if (isBlank(request.getFullName())) {
            errors.put("fullname", "Please enter your name.");
        }

        if (isBlank(request.getEmail()) || !EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
            errors.put("email", "Please enter a valid email.");
        } else if (userRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            errors.put("email", "An account with this email already exists.");
        }

        if (isBlank(request.getPassword()) || request.getPassword().length() < 6) {
            errors.put("password", "Password must be at least 6 characters.");
        }

        if (!errors.isEmpty()) {
            throw new AuthValidationException(errors);
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        User saved = userRepository.save(user);

        return new AuthResponse(saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole(),
                "Account created. You can now sign in.");
    }

    public AuthResponse signin(SigninRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();

        if (isBlank(request.getEmail())) {
            errors.put("email", "Please enter your email.");
        }
        if (isBlank(request.getPassword())) {
            errors.put("password", "Please enter your password.");
        }
        if (!errors.isEmpty()) {
            throw new AuthValidationException(errors);
        }

        User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            errors.put("password", "Incorrect email or password.");
            throw new AuthValidationException(errors);
        }

        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(),
                "Signed in successfully.");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}