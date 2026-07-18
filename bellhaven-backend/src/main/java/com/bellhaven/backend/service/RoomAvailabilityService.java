package com.bellhaven.backend.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.bellhaven.backend.model.Room;
import com.bellhaven.backend.repository.BookingRepository;
import com.bellhaven.backend.repository.RoomRepository;

/**
 * Works out how many rooms of a given type are still free for a date
 * range: totalRooms for that room type, minus bookings whose stay
 * overlaps the requested range.
 */
@Service
public class RoomAvailabilityService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public RoomAvailabilityService(RoomRepository roomRepository, BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Returns rooms of this type still free for [checkin, checkout), or
     * null if roomType doesn't match any known room.
     */
    public Integer roomsLeft(String roomType, LocalDate checkin, LocalDate checkout) {
        Room room = roomRepository.findByNameIgnoreCase(roomType).orElse(null);
        if (room == null) {
            return null;
        }
        long overlapping = bookingRepository.countOverlapping(room.getName(), checkin, checkout);
        return Math.max(room.getTotalRooms() - (int) overlapping, 0);
    }
}