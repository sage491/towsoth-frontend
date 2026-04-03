package com.towsoth.controller;

import com.towsoth.dto.ApiResponse;
import com.towsoth.entity.UserProfile;
import com.towsoth.service.UserService;
import com.towsoth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
@CrossOrigin
public class StudentController {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<UserProfile>> getDashboard(@RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            UserProfile dashboard = userService.getStudentDashboard(studentId);

            return ResponseEntity.ok(new ApiResponse<>(
                true, dashboard, null, "Dashboard retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching dashboard", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch dashboard", 500)
            );
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfile>> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            Optional<UserProfile> profile = userService.getUserProfile(studentId);

            if (profile.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(false, null, "Profile not found", "Student profile not found", 404)
                );
            }
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, profile.get(), null, "Profile retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch profile", 500)
            );
        }
    }
    
    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<UserProfile>> updatePreferences(
            @RequestHeader("Authorization") String token,
            @RequestBody UserProfile.UserPreferences preferences) {
        try {
            String studentId = extractStudentIdFromToken(token);
            UserProfile updated = userService.updateUserPreferences(studentId, preferences);

            return ResponseEntity.ok(new ApiResponse<>(
                true, updated, null, "Preferences updated successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error updating preferences", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to update preferences", 500)
            );
        }
    }
    
    @PostMapping("/enroll/{subjectId}")
    public ResponseEntity<ApiResponse<UserProfile>> enrollSubject(
            @RequestHeader("Authorization") String token,
            @PathVariable String subjectId) {
        try {
            String studentId = extractStudentIdFromToken(token);
            UserProfile updated = userService.enrollSubject(studentId, subjectId);

            return ResponseEntity.ok(new ApiResponse<>(
                true, updated, null, "Subject enrolled successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error enrolling subject", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to enroll subject", 500)
            );
        }
    }
    
    private String extractStudentIdFromToken(String token) {
        try {
            if (token == null || token.isEmpty()) {
                throw new IllegalArgumentException("Token is missing");
            }
            
            String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            if (!jwtUtil.validateToken(actualToken)) {
                throw new IllegalArgumentException("Invalid or expired token");
            }

            String role = jwtUtil.extractRole(actualToken);
            if (!"STUDENT".equalsIgnoreCase(role)) {
                throw new IllegalArgumentException("Access denied: student role required");
            }

            String studentId = jwtUtil.extractUserId(actualToken);
            
            if (studentId == null || studentId.isEmpty()) {
                throw new IllegalArgumentException("Invalid token format");
            }
            
            return studentId;
        } catch (Exception e) {
            log.error("Error extracting student ID from token: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }
}

