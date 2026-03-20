package com.busbooking.backend.controller;

import com.busbooking.backend.dto.BookingRequest;
import com.busbooking.backend.dto.BookingResponse;
import com.busbooking.backend.entity.Booking;
import com.busbooking.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/schedule/{scheduleId}")
    public List<Booking> getBookingsBySchedule(@PathVariable Long scheduleId) {
        return bookingService.getBookingsBySchedule(scheduleId);
    }

    @GetMapping("/schedule/{scheduleId}/booked-seats")
    public List<Integer> getBookedSeatNumbers(@PathVariable Long scheduleId) {
        return bookingService.getBookedSeatNumbers(scheduleId);
    }

    @PostMapping
    public BookingResponse createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        return bookingService.createBooking(bookingRequest);
    }

    @PutMapping("/{bookingId}/cancel")
    public BookingResponse cancelBooking(@PathVariable Long bookingId) {
        return bookingService.cancelBooking(bookingId);
    }
}