package com.bellhaven.backend.service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.bellhaven.backend.dto.BookingRequest;
import com.bellhaven.backend.dto.BookingResponse;
import com.bellhaven.backend.exception.BookingValidationException;
import com.bellhaven.backend.model.Booking;
import com.bellhaven.backend.repository.BookingRepository;
import com.bellhaven.backend.repository.RoomRepository;

@Service
public class BookingService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final EmailService emailService;
    private final RoomAvailabilityService availabilityService;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository,
                           EmailService emailService, RoomAvailabilityService availabilityService) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
        this.availabilityService = availabilityService;
    }

    public BookingResponse createBooking(BookingRequest request) {
        Map<String, String> errors = validate(request);
        if (!errors.isEmpty()) {
            throw new BookingValidationException(errors);
        }

        Booking booking = new Booking();
        booking.setFullName(request.getFullName().trim());
        booking.setEmail(request.getEmail().trim());
        booking.setCheckin(LocalDate.parse(request.getCheckin()));
        booking.setCheckout(LocalDate.parse(request.getCheckout()));
        booking.setRoomType(request.getRoomType());
        booking.setGuests(parseGuests(request.getGuests()));

        Booking saved = bookingRepository.save(booking);

        emailService.sendBookingConfirmation(saved);

        String message = String.format(
                "Your booking is confirmed! A confirmation email has been sent to %s.",
                saved.getEmail());

        return new BookingResponse(saved.getId(), message);
    }

    /**
     * Mirrors Book.jsx's clientSideValidate() field-for-field so the same
     * form ids (fullname, email, checkin, checkout, room) light up whether
     * validation fails on the client or, as a safety net, on the server.
     */
    private Map<String, String> validate(BookingRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();

        if (isBlank(request.getFullName())) {
            errors.put("fullname", "Please enter your name.");
        }

        if (isBlank(request.getEmail()) || !EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
            errors.put("email", "Please enter a valid email.");
        }

        if (isBlank(request.getCheckin())) {
            errors.put("checkin", "Please pick a check-in date.");
        }

        LocalDate checkinDate = parseDateOrNull(request.getCheckin());
        LocalDate checkoutDate = parseDateOrNull(request.getCheckout());
        boolean datesOk = checkinDate != null && checkoutDate != null && checkoutDate.isAfter(checkinDate);
        if (!datesOk) {
            errors.put("checkout", "Check-out must be after check-in.");
        }

        if (isBlank(request.getRoomType())) {
            errors.put("room", "Please choose a room type.");
        } else if (!roomRepository.findAll().stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase(request.getRoomType()))) {
            errors.put("room", "Please choose a valid room type.");
        } else if (datesOk) {
            Integer roomsLeft = availabilityService.roomsLeft(request.getRoomType(), checkinDate, checkoutDate);
            if (roomsLeft != null && roomsLeft <= 0) {
                errors.put("room", "Sorry, no " + request.getRoomType() + " rooms are left for those dates.");
            }
        }

        return errors;
    }

    private Integer parseGuests(String guests) {
        try {
            return guests == null || guests.isBlank() ? null : Integer.valueOf(guests.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private LocalDate parseDateOrNull(String value) {
        if (isBlank(value)) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}