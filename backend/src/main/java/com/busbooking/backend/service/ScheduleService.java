package com.busbooking.backend.service;

import com.busbooking.backend.dto.ScheduleRequest;
import com.busbooking.backend.entity.Route;
import com.busbooking.backend.entity.Schedule;
import com.busbooking.backend.exception.ResourceNotFoundException;
import com.busbooking.backend.repository.RouteRepository;
import com.busbooking.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final RouteRepository routeRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, RouteRepository routeRepository) {
        this.scheduleRepository = scheduleRepository;
        this.routeRepository = routeRepository;
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public List<Schedule> getSchedulesByRoute(Long routeId) {
        return scheduleRepository.findByRouteId(routeId);
    }

    public Schedule createSchedule(ScheduleRequest scheduleRequest) {
        Route route = routeRepository.findById(scheduleRequest.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found."));

        Schedule schedule = new Schedule();
        schedule.setRoute(route);
        schedule.setTravelDate(LocalDate.parse(scheduleRequest.getTravelDate()));
        schedule.setDepartureTime(LocalTime.parse(scheduleRequest.getDepartureTime()));
        schedule.setBusNumber(scheduleRequest.getBusNumber());
        schedule.setTotalSeats(scheduleRequest.getTotalSeats());

        return scheduleRepository.save(schedule);
    }
}