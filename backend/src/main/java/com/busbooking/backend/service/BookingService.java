package com.busbooking.backend.service;

import com.busbooking.backend.dto.BookingRequest;
import com.busbooking.backend.dto.BookingResponse;
import com.busbooking.backend.entity.Booking;
import com.busbooking.backend.entity.Schedule;
import com.busbooking.backend.exception.ResourceNotFoundException;
import com.busbooking.backend.exception.SeatAlreadyBookedException;
import com.busbooking.backend.repository.BookingRepository;
import com.busbooking.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;

    public BookingService(BookingRepository bookingRepository, ScheduleRepository scheduleRepository) {
        this.bookingRepository = bookingRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsBySchedule(Long scheduleId) {
        return bookingRepository.findBySchedule_Id(scheduleId);
    }

    // ── Get bookings by userId
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Integer> getBookedSeatNumbers(Long scheduleId) {
        return bookingRepository.findBySchedule_Id(scheduleId).stream()
                .filter(booking ->
                        // Include PENDING so seats can't be double-booked
                        "PENDING".equalsIgnoreCase(booking.getStatus()) ||
                                "BOOKED".equalsIgnoreCase(booking.getStatus()) ||
                                "RESERVED".equalsIgnoreCase(booking.getStatus()))
                .map(Booking::getSeatNumber)
                .collect(Collectors.toList());
    }

    public BookingResponse createBooking(BookingRequest bookingRequest) {

        // Check if seat is already taken (including PENDING seats)
        boolean seatAlreadyBooked = bookingRepository.findBySchedule_Id(bookingRequest.getScheduleId())
                .stream()
                .anyMatch(booking ->
                        booking.getSeatNumber().equals(bookingRequest.getSeatNumber()) &&
                                ("PENDING".equalsIgnoreCase(booking.getStatus()) ||
                                        "BOOKED".equalsIgnoreCase(booking.getStatus()) ||
                                        "RESERVED".equalsIgnoreCase(booking.getStatus()))
                );

        if (seatAlreadyBooked) {
            throw new SeatAlreadyBookedException("Seat is already booked or reserved.");
        }

        Schedule schedule = scheduleRepository.findById(bookingRequest.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found."));

        Booking booking = new Booking();
        booking.setBookingId(generateBookingId());
        booking.setPassengerName(bookingRequest.getPassengerName());
        booking.setPhoneNumber(bookingRequest.getPhoneNumber());
        booking.setSeatNumber(bookingRequest.getSeatNumber());

        // ── Initial status is PENDING (admin must confirm/cancel)
        booking.setStatus("PENDING");

        booking.setSchedule(schedule);

        // ── Payment fields
        booking.setAdvancePayment(bookingRequest.getAdvancePayment());
        booking.setPayAtBus(bookingRequest.getPayAtBus());
        booking.setTotalPrice(bookingRequest.getTotalPrice());

        // ── Link booking to user
        booking.setUserId(bookingRequest.getUserId());

        Booking savedBooking = bookingRepository.save(booking);

        return new BookingResponse(
                "Booking created successfully",
                savedBooking.getBookingId(),
                savedBooking.getPassengerName(),
                savedBooking.getPhoneNumber(),
                savedBooking.getSeatNumber(),
                savedBooking.getStatus(),
                savedBooking.getSchedule().getId(),
                savedBooking.getAdvancePayment(),
                savedBooking.getPayAtBus(),
                savedBooking.getTotalPrice()
        );
    }

    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);

        return new BookingResponse(
                "Booking cancelled successfully",
                updatedBooking.getBookingId(),
                updatedBooking.getPassengerName(),
                updatedBooking.getPhoneNumber(),
                updatedBooking.getSeatNumber(),
                updatedBooking.getStatus(),
                updatedBooking.getSchedule().getId(),
                updatedBooking.getAdvancePayment(),
                updatedBooking.getPayAtBus(),
                updatedBooking.getTotalPrice()
        );
    }

    public BookingResponse reserveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        // ── Admin confirming booking → BOOKED
        booking.setStatus("BOOKED");
        Booking updatedBooking = bookingRepository.save(booking);

        return new BookingResponse(
                "Booking confirmed successfully",
                updatedBooking.getBookingId(),
                updatedBooking.getPassengerName(),
                updatedBooking.getPhoneNumber(),
                updatedBooking.getSeatNumber(),
                updatedBooking.getStatus(),
                updatedBooking.getSchedule().getId(),
                updatedBooking.getAdvancePayment(),
                updatedBooking.getPayAtBus(),
                updatedBooking.getTotalPrice()
        );
    }

    private String generateBookingId() {
        return "BSB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}