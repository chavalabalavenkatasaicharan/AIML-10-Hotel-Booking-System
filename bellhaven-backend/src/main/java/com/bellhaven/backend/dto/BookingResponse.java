package com.bellhaven.backend.dto;

/**
 * On success, Book.jsx reads result.data.message and shows it in the
 * confirmation box, so this must always contain a "message" field.
 */
public class BookingResponse {

    private Long id;
    private String message;

    public BookingResponse() {
    }

    public BookingResponse(Long id, String message) {
        this.id = id;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
