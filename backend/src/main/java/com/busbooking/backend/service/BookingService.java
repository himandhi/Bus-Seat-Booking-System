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

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // ── Returns all booked/pending seat numbers for a schedule ──
    public List<Integer> getBookedSeatNumbers(Long scheduleId) {
        return bookingRepository.findBySchedule_Id(scheduleId).stream()
                .filter(b -> "PENDING".equalsIgnoreCase(b.getStatus()) ||
                        "BOOKED".equalsIgnoreCase(b.getStatus()) ||
                        "RESERVED".equalsIgnoreCase(b.getStatus()))
                .flatMap(b -> {
                    // Support both old single seat and new multi-seat
                    if (b.getSeatNumbers() != null && !b.getSeatNumbers().isBlank()) {
                        return java.util.Arrays.stream(b.getSeatNumbers().split(","))
                                .map(String::trim)
                                .map(Integer::parseInt);
                    }
                    return b.getSeatNumber() != null
                            ? java.util.stream.Stream.of(b.getSeatNumber())
                            : java.util.stream.Stream.empty();
                })
                .collect(Collectors.toList());
    }

    // ── Create ONE booking for multiple seats ──────────────────
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        List<Booking> existing = bookingRepository.findBySchedule_Id(bookingRequest.getScheduleId());

        // Collect all already-taken seat numbers for this schedule
        List<Integer> takenSeats = existing.stream()
                .filter(b -> "PENDING".equalsIgnoreCase(b.getStatus()) ||
                        "BOOKED".equalsIgnoreCase(b.getStatus()) ||
                        "RESERVED".equalsIgnoreCase(b.getStatus()))
                .flatMap(b -> {
                    if (b.getSeatNumbers() != null && !b.getSeatNumbers().isBlank()) {
                        return java.util.Arrays.stream(b.getSeatNumbers().split(","))
                                .map(String::trim)
                                .map(Integer::parseInt);
                    }
                    return b.getSeatNumber() != null
                            ? java.util.stream.Stream.of(b.getSeatNumber())
                            : java.util.stream.Stream.empty();
                })
                .collect(Collectors.toList());

        // Check requested seats against taken seats
        List<Integer> requestedSeats = bookingRequest.getSeatNumbers();
        if (requestedSeats != null && !requestedSeats.isEmpty()) {
            for (Integer seat : requestedSeats) {
                if (takenSeats.contains(seat)) {
                    throw new SeatAlreadyBookedException("Seat #" + seat + " is already booked or reserved.");
                }
            }
        } else {
            // Fallback: single seat
            if (takenSeats.contains(bookingRequest.getSeatNumber())) {
                throw new SeatAlreadyBookedException("Seat is already booked or reserved.");
            }
        }

        Schedule schedule = scheduleRepository.findById(bookingRequest.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found."));

        Booking booking = new Booking();
        booking.setBookingId(generateBookingId());
        booking.setPassengerName(bookingRequest.getPassengerName());
        booking.setPhoneNumber(bookingRequest.getPhoneNumber());
        booking.setStatus("PENDING");
        booking.setSchedule(schedule);
        booking.setAdvancePayment(bookingRequest.getAdvancePayment());
        booking.setPayAtBus(bookingRequest.getPayAtBus());
        booking.setTotalPrice(bookingRequest.getTotalPrice());
        booking.setUserId(bookingRequest.getUserId());

        // ── Store all seat numbers as comma-separated string ──
        if (requestedSeats != null && !requestedSeats.isEmpty()) {
            String seatNumsStr = requestedSeats.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));
            booking.setSeatNumbers(seatNumsStr);
            // Keep first seat in legacy field for backward compatibility
            booking.setSeatNumber(requestedSeats.get(0));
        } else {
            booking.setSeatNumber(bookingRequest.getSeatNumber());
            booking.setSeatNumbers(String.valueOf(bookingRequest.getSeatNumber()));
        }

        Booking saved = bookingRepository.save(booking);

        return new BookingResponse(
                "Booking created successfully",
                saved.getBookingId(),
                saved.getPassengerName(),
                saved.getPhoneNumber(),
                saved.getSeatNumber(),
                saved.getStatus(),
                saved.getSchedule().getId(),
                saved.getAdvancePayment(),
                saved.getPayAtBus(),
                saved.getTotalPrice()
        );
    }

    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
        booking.setStatus("CANCELLED");
        Booking updated = bookingRepository.save(booking);
        return buildResponse("Booking cancelled successfully", updated);
    }

    public BookingResponse reserveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
        booking.setStatus("BOOKED");
        Booking updated = bookingRepository.save(booking);
        return buildResponse("Booking confirmed successfully", updated);
    }

    private BookingResponse buildResponse(String message, Booking b) {
        return new BookingResponse(
                message,
                b.getBookingId(),
                b.getPassengerName(),
                b.getPhoneNumber(),
                b.getSeatNumber(),
                b.getStatus(),
                b.getSchedule().getId(),
                b.getAdvancePayment(),
                b.getPayAtBus(),
                b.getTotalPrice()
        );
    }

    private String generateBookingId() {
        return "BSB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}