package com.busbooking.backend.service;

import com.busbooking.backend.entity.Route;
import com.busbooking.backend.exception.ResourceNotFoundException;
import com.busbooking.backend.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route addRoute(Route route) {
        return routeRepository.save(route);
    }

    public Route updateRoute(Long id, Route updatedRoute) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found."));
        route.setFromCity(updatedRoute.getFromCity());
        route.setToCity(updatedRoute.getToCity());
        route.setPrice(updatedRoute.getPrice());
        route.setDuration(updatedRoute.getDuration());
        return routeRepository.save(route);
    }

    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }
}