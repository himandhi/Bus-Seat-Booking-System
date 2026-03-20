package com.busbooking.backend.controller;

import com.busbooking.backend.dto.BookingRequest;
import com.busbooking.backend.entity.Booking;
import com.busbooking.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/schedule/{scheduleId}")
    public List<Booking> getBookingsBySchedule(@PathVariable Long scheduleId) {
        return bookingService.getBookingsBySchedule(scheduleId);
    }

    @PostMapping
    public Booking createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        return bookingService.createBooking(bookingRequest);
    }
}