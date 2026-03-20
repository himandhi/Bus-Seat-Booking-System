package com.busbooking.backend.service;

import com.busbooking.backend.dto.BookingRequest;
import com.busbooking.backend.entity.Booking;
import com.busbooking.backend.entity.Schedule;
import com.busbooking.backend.repository.BookingRepository;
import com.busbooking.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;

    public BookingService(BookingRepository bookingRepository, ScheduleRepository scheduleRepository) {
        this.bookingRepository = bookingRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<Booking> getBookingsBySchedule(Long scheduleId) {
        return bookingRepository.findByScheduleId(scheduleId);
    }

    public Booking createBooking(BookingRequest bookingRequest) {
        boolean seatAlreadyBooked = bookingRepository
                .existsByScheduleIdAndSeatNumberAndStatus(
                        bookingRequest.getScheduleId(),
                        bookingRequest.getSeatNumber(),
                        "BOOKED"
                );

        if (seatAlreadyBooked) {
            throw new RuntimeException("Seat is already booked.");
        }

        Schedule schedule = scheduleRepository.findById(bookingRequest.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found."));

        Booking booking = new Booking();
        booking.setBookingId(generateBookingId());
        booking.setPassengerName(bookingRequest.getPassengerName());
        booking.setPhoneNumber(bookingRequest.getPhoneNumber());
        booking.setSeatNumber(bookingRequest.getSeatNumber());
        booking.setStatus("BOOKED");
        booking.setSchedule(schedule);

        return bookingRepository.save(booking);
    }

    private String generateBookingId() {
        return "BSB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}