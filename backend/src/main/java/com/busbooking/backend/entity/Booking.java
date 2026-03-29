package com.busbooking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false, unique = true)
    private String bookingId;

    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    // ── Legacy single seat (kept for backward compatibility)
    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    // ── NEW: comma-separated seat numbers e.g. "2,5,8"
    @Column(name = "seat_numbers")
    private String seatNumbers;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "advance_payment", nullable = false)
    private int advancePayment;

    @Column(name = "pay_at_bus", nullable = false)
    private int payAtBus;

    @Column(name = "total_price", nullable = false)
    private int totalPrice;

    @Column(name = "user_id")
    private Long userId;
}