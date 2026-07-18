package com.bellhaven.backend.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bellhaven.backend.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Bookings of this room type whose stay overlaps the given range.
    // Two ranges overlap when one starts before the other ends, in
    // both directions - checkout is treated as exclusive (the day a
    // guest leaves, that room is free again for a new check-in).
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE LOWER(b.roomType) = LOWER(:roomType) " +
           "AND b.checkin < :checkout AND b.checkout > :checkin")
    long countOverlapping(@Param("roomType") String roomType,
                          @Param("checkin") LocalDate checkin,
                          @Param("checkout") LocalDate checkout);
}