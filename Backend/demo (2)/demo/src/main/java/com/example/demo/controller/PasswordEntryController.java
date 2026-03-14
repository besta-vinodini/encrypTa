package com.example.demo.controller;

import com.example.demo.model.PasswordEntry;
import com.example.demo.service.PasswordEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordEntryController {

    @Autowired
    private PasswordEntryService service;

    // Add new password
    @PostMapping
    public PasswordEntry addPassword(@RequestBody PasswordEntry entry){
        return service.addPassword(entry);
    }

    @GetMapping("/user/{userId}")
    public List<PasswordEntry> getPasswordsByUser(@PathVariable Long userId){
        return service.getPasswordsByUser(userId);
    }

    // Delete password
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassword(@PathVariable Long id){
        service.deletePassword(id);
        return ResponseEntity.noContent().build();
    }

    // Update password
    @PutMapping("/{id}")
    public PasswordEntry updatePassword(@PathVariable Long id, @RequestBody PasswordEntry entry){
        return service.updatePassword(id, entry);
    }
}