package com.busbooking.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScheduleRequest {

    @NotNull(message = "Route ID is required")
    private Long routeId;

    @NotBlank(message = "Travel date is required")
    private String travelDate;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotNull(message = "Total seats is required")
    private Integer totalSeats;
}