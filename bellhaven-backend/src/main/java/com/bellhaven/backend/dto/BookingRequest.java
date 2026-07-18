package com.bellhaven.backend.dto;

/**
 * Mirrors the payload sent by the frontend's submitBooking() in src/api.js:
 * { fullName, email, checkin, checkout, roomType, guests }
 * All fields are plain Strings here on purpose — real validation (required,
 * format, date ordering) is done in BookingService so we can return the
 * exact field-name -> message map the Book.jsx form expects.
 */
public class BookingRequest {

    private String fullName;
    private String email;
    private String checkin;
    private String checkout;
    private String roomType;
    private String guests;

    public BookingRequest() {
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

    public String getCheckin() {
        return checkin;
    }

    public void setCheckin(String checkin) {
        this.checkin = checkin;
    }

    public String getCheckout() {
        return checkout;
    }

    public void setCheckout(String checkout) {
        this.checkout = checkout;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getGuests() {
        return guests;
    }

    public void setGuests(String guests) {
        this.guests = guests;
    }
}
