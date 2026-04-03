package com.towsoth.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
@CrossOrigin
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        log.info("Health check requested");
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Towsoth Backend API",
            "version", "1.0.0"
        ));
    }
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> info() {
        log.info("Info requested");
        return ResponseEntity.ok(Map.of(
            "name", "Towsoth Backend",
            "description", "Enterprise-grade learning platform backend",
            "version", "1.0.0",
            "author", "Towsoth Team"
        ));
    }
}

