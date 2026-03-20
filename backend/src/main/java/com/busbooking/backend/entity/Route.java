package com.busbooking.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "routes")
@Data
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_city", nullable = false)
    private String fromCity;

    @Column(name = "to_city", nullable = false)
    private String toCity;

    @OneToMany(mappedBy = "route")
    @JsonIgnore
    private List<Schedule> schedules;
}