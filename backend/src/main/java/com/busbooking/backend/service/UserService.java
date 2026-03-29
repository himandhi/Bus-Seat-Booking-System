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

    // ── Register with proper duplicate checks BEFORE saving ──
    public User register(User user) {
        boolean emailExists = userRepository.existsByEmail(user.getEmail());
        boolean phoneExists = userRepository.existsByPhone(user.getPhone());

        // Both email AND phone already exist → user already exists
        if (emailExists && phoneExists) {
            throw new RuntimeException("This user already exists.");
        }
        // Only email already taken
        if (emailExists) {
            throw new RuntimeException("Email already registered.");
        }
        // Only phone already taken
        if (phoneExists) {
            throw new RuntimeException("Phone number already registered.");
        }

        user.setRole("USER");
        // TODO: hash password with BCrypt before saving
        return userRepository.save(user);
    }

    // ── Login ─────────────────────────────────────────────────
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));
        // TODO: use BCrypt to compare hashed password
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password.");
        }
        return user;
    }

    // ── Update Profile ────────────────────────────────────────
    public User updateProfile(Long id, String name, String email, String phone) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        return userRepository.save(user);
    }

    // ── Change Password ───────────────────────────────────────
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