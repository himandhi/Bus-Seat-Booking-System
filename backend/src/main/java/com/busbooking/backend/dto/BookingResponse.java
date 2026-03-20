package com.busbooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingResponse {
    private String message;
    private String bookingId;
    private String passengerName;
    private String phoneNumber;
    private Integer seatNumber;
    private String status;
    private Long scheduleId;
}