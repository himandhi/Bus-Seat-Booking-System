package com.busbooking.backend.controller;

import com.busbooking.backend.entity.Route;
import com.busbooking.backend.repository.RouteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RouteController {

    private final RouteRepository routeRepository;

    public RouteController(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    @GetMapping("/api/routes")
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}