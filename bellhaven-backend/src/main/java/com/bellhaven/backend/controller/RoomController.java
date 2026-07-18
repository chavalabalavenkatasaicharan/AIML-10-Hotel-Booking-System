package com.bellhaven.backend.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bellhaven.backend.model.Room;
import com.bellhaven.backend.repository.RoomRepository;
import com.bellhaven.backend.service.RoomAvailabilityService;

/**
 * Backs fetchRooms() and checkAvailability() in src/api.js.
 * GET /api/rooms               -> all rooms (used by Rooms.jsx and Book.jsx)
 * GET /api/rooms?preview=3     -> first 3 rooms (used by Home.jsx)
 * GET /api/rooms/availability  -> rooms left of a given type for a date range
 */
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomRepository roomRepository;
    private final RoomAvailabilityService availabilityService;

    public RoomController(RoomRepository roomRepository, RoomAvailabilityService availabilityService) {
        this.roomRepository = roomRepository;
        this.availabilityService = availabilityService;
    }

    @GetMapping
    public List<Room> getRooms(@RequestParam(required = false) Integer preview) {
        List<Room> rooms = roomRepository.findAllByOrderByDisplayOrderAsc();
        if (preview != null && preview > 0 && preview < rooms.size()) {
            return rooms.subList(0, preview);
        }
        return rooms;
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @RequestParam String room,
            @RequestParam String checkin,
            @RequestParam String checkout) {

        LocalDate checkinDate;
        LocalDate checkoutDate;
        try {
            checkinDate = LocalDate.parse(checkin);
            checkoutDate = LocalDate.parse(checkout);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please provide valid dates."));
        }

        if (!checkoutDate.isAfter(checkinDate)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Check-out must be after check-in."));
        }

        Integer roomsLeft = availabilityService.roomsLeft(room, checkinDate, checkoutDate);
        if (roomsLeft == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Unknown room type."));
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("available", roomsLeft > 0);
        body.put("roomsLeft", roomsLeft);
        return ResponseEntity.ok(body);
    }
}