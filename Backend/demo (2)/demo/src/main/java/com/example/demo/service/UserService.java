package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public String register(User user) {

        if (repo.findByEmail(user.getEmail()).isPresent())
            return "User already exist";

        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return "User registered successfully";
    }

    public boolean login(String email, String password) {
        Optional<User> userOpt = repo.findByEmail(email);

        if (userOpt.isEmpty())
            return false;

        return encoder.matches(password, userOpt.get().getPassword());
    }

    public User getUserByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }

    // Re-authentication: verify password by user ID
    public boolean verifyPassword(Long userId, String rawPassword) {
        Optional<User> userOpt = repo.findById(userId);
        if (userOpt.isEmpty()) return false;
        return encoder.matches(rawPassword, userOpt.get().getPassword());
    }
}
