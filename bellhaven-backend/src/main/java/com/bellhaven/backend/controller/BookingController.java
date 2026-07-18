package com.bellhaven.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bellhaven.backend.dto.BookingRequest;
import com.bellhaven.backend.dto.BookingResponse;
import com.bellhaven.backend.service.BookingService;

/**
 * Backs submitBooking() in src/api.js.
 * POST /api/bookings
 *   -> 200 with { id, message } on success
 *   -> 400 with { fieldName: message } on validation failure
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
