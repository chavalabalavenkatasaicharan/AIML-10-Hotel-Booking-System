package com.bellhaven.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Provides a BCryptPasswordEncoder used to hash user passwords before
 * saving them, and to check them on signin. This does NOT add Spring
 * Security's login page or auth filters - all /api/** endpoints stay
 * open exactly as before.
 */
@Configuration
public class SecurityBeansConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}