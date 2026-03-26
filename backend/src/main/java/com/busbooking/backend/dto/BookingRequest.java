package com.busbooking.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @NotNull(message = "Seat number is required")
    private Integer seatNumber;

    private int advancePayment;
    private int payAtBus;
    private int totalPrice;
    private Long userId;
}