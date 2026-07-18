package com.bellhaven.backend.exception;

import java.util.Map;

/**
 * Thrown when a signup/signin request fails validation, or signin
 * credentials don't match. Carries a field-name -> message map
 * (keys: fullname, email, password) so GlobalExceptionHandler can
 * turn it straight into the JSON body of a 400 response, the same
 * way BookingValidationException does for the booking form.
 */
public class AuthValidationException extends RuntimeException {

    private final Map<String, String> errors;

    public AuthValidationException(Map<String, String> errors) {
        super("Auth request failed validation");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}