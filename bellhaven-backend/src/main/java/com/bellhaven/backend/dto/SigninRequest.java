package com.bellhaven.backend.dto;

/**
 * Mirrors the payload sent by the frontend's signin() in src/api.js:
 * { email, password }
 */
public class SigninRequest {

    private String email;
    private String password;

    public SigninRequest() {
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
}