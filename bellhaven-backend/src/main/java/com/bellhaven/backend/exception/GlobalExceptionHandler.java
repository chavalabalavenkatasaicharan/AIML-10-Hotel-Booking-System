package com.bellhaven.backend.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Book.jsx does: if (res.status === 400) { const errors = await res.json(); ... }
    // and expects a plain { fieldName: "message" } object, so that's exactly
    // what we return here.
    @ExceptionHandler(BookingValidationException.class)
    public ResponseEntity<Map<String, String>> handleBookingValidation(BookingValidationException ex) {
        return ResponseEntity.badRequest().body(ex.getErrors());
    }

    // SignIn.jsx / SignUp.jsx do: if (res.status === 400) { const errors = await res.json(); ... }
    // just like the booking form, so this returns the same { fieldName: "message" } shape.
    @ExceptionHandler(AuthValidationException.class)
    public ResponseEntity<Map<String, String>> handleAuthValidation(AuthValidationException ex) {
        return ResponseEntity.badRequest().body(ex.getErrors());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleUnexpected(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Something went wrong. Please try again."));
    }
}