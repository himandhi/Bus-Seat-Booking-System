package com.busbooking.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @NotNull(message = "Seat number is required")
    private Integer seatNumber;       // primary seat (legacy, backward compatible)

    private List<Integer> seatNumbers; // ── NEW: all selected seats as a list e.g. [2, 5, 8]

    private int advancePayment;
    private int payAtBus;
    private int totalPrice;
    private Long userId;
}