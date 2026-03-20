package com.busbooking.backend.repository;

import com.busbooking.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByScheduleId(Long scheduleId);

    boolean existsByScheduleIdAndSeatNumberAndStatus(Long scheduleId, Integer seatNumber, String status);
}