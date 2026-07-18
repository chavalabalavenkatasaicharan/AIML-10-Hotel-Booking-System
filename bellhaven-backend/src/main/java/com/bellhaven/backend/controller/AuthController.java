package com.bellhaven.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bellhaven.backend.dto.AuthResponse;
import com.bellhaven.backend.dto.SigninRequest;
import com.bellhaven.backend.dto.SignupRequest;
import com.bellhaven.backend.service.UserService;

/**
 * Backs signup() and signin() in src/api.js.
 * POST /api/auth/signup -> 201 with AuthResponse on success, 400 with field errors otherwise
 * POST /api/auth/signin -> 200 with AuthResponse on success, 400 with field errors otherwise
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        AuthResponse response = userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody SigninRequest request) {
        AuthResponse response = userService.signin(request);
        return ResponseEntity.ok(response);
    }
}