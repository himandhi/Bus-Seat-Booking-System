package com.busbooking.backend.service;

import com.busbooking.backend.entity.User;
import com.busbooking.backend.exception.ResourceNotFoundException;
import com.busbooking.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register new user
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }
        user.setRole("USER");
        // TODO: hash password with BCrypt before saving
        return userRepository.save(user);
    }

    // Login
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));
        // TODO: use BCrypt to compare hashed password
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password.");
        }
        return user;
    }

    // Update profile
    public User updateProfile(Long id, String name, String email, String phone) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        return userRepository.save(user);
    }

    // Change password
    public void changePassword(Long id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        // TODO: use BCrypt to compare hashed password
        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("Current password is incorrect.");
        }
        user.setPassword(newPassword);
        userRepository.save(user);
    }
}