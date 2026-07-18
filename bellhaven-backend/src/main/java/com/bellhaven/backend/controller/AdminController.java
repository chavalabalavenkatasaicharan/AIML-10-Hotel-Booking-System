package com.bellhaven.backend.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bellhaven.backend.exception.AuthValidationException;
import com.bellhaven.backend.model.Booking;
import com.bellhaven.backend.model.User;
import com.bellhaven.backend.repository.BookingRepository;
import com.bellhaven.backend.repository.UserRepository;

/**
 * Backs fetchAdminBookings()/fetchAdminUsers() in src/api.js, used by
 * the Admin Dashboard page.
 *
 * NOTE: this project has no login sessions/tokens, so these endpoints
 * are only lightly guarded (the /users endpoint checks that the given
 * adminEmail belongs to an ADMIN account). The frontend also only
 * shows the /admin route to users who signed in with an ADMIN role.
 * For a real deployment, put these behind proper authentication
 * (e.g. Spring Security + JWT) instead.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public AdminController(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/users")
    public List<User> getAllUsers(@RequestParam(required = false) String adminEmail) {
        if (adminEmail != null) {
            User requester = userRepository.findByEmailIgnoreCase(adminEmail).orElse(null);
            if (requester == null || !"ADMIN".equals(requester.getRole())) {
                Map<String, String> errors = new LinkedHashMap<>();
                errors.put("admin", "Not authorized.");
                throw new AuthValidationException(errors);
            }
        }
        return userRepository.findAll();
    }
}