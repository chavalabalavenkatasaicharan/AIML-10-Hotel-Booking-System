package com.bellhaven.backend.exception;

import java.util.Map;

/**
 * Thrown when a booking request fails validation. Carries a
 * field-name -> message map matching exactly what Book.jsx expects
 * (keys: fullname, email, checkin, checkout, room) so the
 * GlobalExceptionHandler can turn it straight into the JSON body
 * of a 400 response.
 */
public class BookingValidationException extends RuntimeException {

    private final Map<String, String> errors;

    public BookingValidationException(Map<String, String> errors) {
        super("Booking request failed validation");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
