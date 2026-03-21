package com.example.demo.service;

import com.example.demo.model.PasswordEntry;
import com.example.demo.util.AESUtil;
import com.example.demo.repository.PasswordEntryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PasswordEntryService {

    @Autowired
    private PasswordEntryRepo repository;

    public PasswordEntry addPassword(PasswordEntry entry) {
        String encryptedPassword = AESUtil.encrypt(entry.getPassword());
        entry.setPassword(encryptedPassword);

        // Default category if not provided
        if (entry.getCategory() == null || entry.getCategory().isBlank()) {
            entry.setCategory("Others");
        }

        PasswordEntry saved = repository.save(entry);

        // Return with decrypted password for immediate display
        PasswordEntry result = new PasswordEntry();
        result.setEntryId(saved.getEntryId());
        result.setWebsite(saved.getWebsite());
        result.setUsername(saved.getUsername());
        result.setPassword(AESUtil.decrypt(saved.getPassword()));
        result.setCategory(saved.getCategory());
        result.setUser(saved.getUser());
        return result;
    }

    public List<PasswordEntry> getAllPasswords() {
        List<PasswordEntry> list = repository.findAll();
        return list.stream().map(entry -> {
            PasswordEntry result = new PasswordEntry();
            result.setEntryId(entry.getEntryId());
            result.setWebsite(entry.getWebsite());
            result.setUsername(entry.getUsername());
            result.setPassword(AESUtil.decrypt(entry.getPassword()));
            result.setCategory(entry.getCategory());
            result.setUser(entry.getUser());
            return result;
        }).collect(Collectors.toList());
    }

    public void deletePassword(Long id) {
        repository.deleteById(id);
    }

    public PasswordEntry updatePassword(Long id, PasswordEntry updated) {
        PasswordEntry entry = repository.findById(id).orElse(null);

        if (entry != null) {
            entry.setWebsite(updated.getWebsite());
            entry.setUsername(updated.getUsername());

            String encrypted = AESUtil.encrypt(updated.getPassword());
            entry.setPassword(encrypted);

            if (updated.getCategory() != null && !updated.getCategory().isBlank()) {
                entry.setCategory(updated.getCategory());
            }

            PasswordEntry saved = repository.save(entry);

            PasswordEntry result = new PasswordEntry();
            result.setEntryId(saved.getEntryId());
            result.setWebsite(saved.getWebsite());
            result.setUsername(saved.getUsername());
            result.setPassword(AESUtil.decrypt(saved.getPassword()));
            result.setCategory(saved.getCategory());
            result.setUser(saved.getUser());
            return result;
        }

        return null;
    }

    // Returns passwords with MASKED passwords (for security)
    public List<PasswordEntry> getPasswordsByUser(Long userId) {
        List<PasswordEntry> entries = repository.findByUserId(userId);

        return entries.stream().map(entry -> {
            PasswordEntry result = new PasswordEntry();
            result.setEntryId(entry.getEntryId());
            result.setWebsite(entry.getWebsite());
            result.setUsername(entry.getUsername());
            result.setPassword("••••••••"); // masked
            result.setCategory(entry.getCategory() != null ? entry.getCategory() : "Others");
            result.setUser(entry.getUser());
            return result;
        }).collect(Collectors.toList());
    }

    // Returns the DECRYPTED password for a single entry (after re-authentication)
    public String getDecryptedPassword(Long entryId) {
        PasswordEntry entry = repository.findById(entryId).orElse(null);
        if (entry == null) return null;
        return AESUtil.decrypt(entry.getPassword());
    }
}