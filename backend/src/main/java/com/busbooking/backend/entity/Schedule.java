package com.busbooking.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "schedules")
@Data
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate;

    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @Column(name = "bus_number", nullable = false)
    private String busNumber;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    // ── NEW: A/C or Non-A/C bus type
    @Column(name = "ac_type", nullable = false)
    private String acType = "Non-A/C";

    @OneToMany(mappedBy = "schedule")
    @JsonIgnore
    private List<Booking> bookings;
}