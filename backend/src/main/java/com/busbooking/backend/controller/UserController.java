package com.busbooking.backend.controller;

import com.busbooking.backend.entity.User;
import com.busbooking.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // Login
    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> body) {
        return userService.login(body.get("email"), body.get("password"));
    }

    // Update profile
    @PutMapping("/{id}/profile")
    public User updateProfile(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userService.updateProfile(
                id,
                body.get("name"),
                body.get("email"),
                body.get("phone")
        );
    }

    // Change password
    @PutMapping("/{id}/change-password")
    public Map<String, String> changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        userService.changePassword(id, body.get("currentPassword"), body.get("newPassword"));
        return Map.of("message", "Password changed successfully.");
    }
}