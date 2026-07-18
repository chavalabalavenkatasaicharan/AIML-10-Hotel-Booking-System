package com.bellhaven.backend.service;

import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.bellhaven.backend.model.Booking;

import jakarta.mail.internet.MimeMessage;

/**
 * Sends the booking confirmation email once a booking is saved.
 *
 * Failures here are logged and swallowed rather than propagated -
 * a bad SMTP config or a transient send failure should never cause
 * the booking itself (which is already persisted) to fail or roll back.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEE, MMM d, yyyy");

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailService(JavaMailSender mailSender,
                         @Value("${bellhaven.mail.from:}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendBookingConfirmation(Booking booking) {
        if (fromAddress == null || fromAddress.isBlank()) {
            log.warn("Skipping booking confirmation email for booking {} - MAIL_USERNAME is not configured.",
                    booking.getId());
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(booking.getEmail());
            helper.setFrom(fromAddress, "Bellhaven Hotel");
            helper.setSubject("Your Bellhaven booking is confirmed - #" + booking.getId());
            helper.setText(buildHtmlBody(booking), true);

            mailSender.send(message);
            log.info("Sent booking confirmation email for booking {} to {}", booking.getId(), booking.getEmail());
        } catch (MailException | jakarta.mail.MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send booking confirmation email for booking {}: {}",
                    booking.getId(), e.getMessage());
        }
    }

    private String buildHtmlBody(Booking booking) {
        String checkin = booking.getCheckin().format(DATE_FORMAT);
        String checkout = booking.getCheckout().format(DATE_FORMAT);
        String guests = booking.getGuests() != null ? String.valueOf(booking.getGuests()) : "-";

        return "<div style=\"font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; color: #2b2620;\">"
                + "<div style=\"background-color: #2b2620; padding: 24px 32px;\">"
                + "<span style=\"color: #f4ede4; font-size: 20px; letter-spacing: 1px;\">BELLHAVEN HOTEL</span>"
                + "</div>"
                + "<div style=\"padding: 32px; border: 1px solid #e5ddd0; border-top: none;\">"
                + "<h2 style=\"margin-top: 0; color: #2b2620;\">Booking confirmed, " + escape(booking.getFullName()) + "</h2>"
                + "<p>Thank you for choosing Bellhaven. Here are your reservation details:</p>"
                + "<table style=\"width: 100%; border-collapse: collapse; margin: 20px 0;\">"
                + row("Confirmation #", String.valueOf(booking.getId()))
                + row("Room", escape(booking.getRoomType()))
                + row("Check-in", checkin)
                + row("Check-out", checkout)
                + row("Guests", guests)
                + "</table>"
                + "<p>We look forward to hosting you. If anything about your reservation needs to change, just reply to this email.</p>"
                + "<p style=\"margin-top: 32px; font-size: 13px; color: #8a8074;\">Bellhaven Hotel</p>"
                + "</div>"
                + "</div>";
    }

    private String row(String label, String value) {
        return "<tr>"
                + "<td style=\"padding: 8px 0; color: #8a8074; width: 140px;\">" + label + "</td>"
                + "<td style=\"padding: 8px 0; font-weight: bold;\">" + value + "</td>"
                + "</tr>";
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}