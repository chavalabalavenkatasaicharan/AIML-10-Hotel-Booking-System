package com.bellhaven.backend.dto;

/**
 * On success, SignIn.jsx/SignUp.jsx store this whole object in
 * localStorage (as "bellhavenUser") and read .role to decide whether
 * to route to "/" or "/admin".
 */
public class AuthResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String fullName, String email, String role, String message) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}