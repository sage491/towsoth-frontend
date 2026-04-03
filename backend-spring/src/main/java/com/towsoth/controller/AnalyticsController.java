package com.towsoth.controller;

import com.towsoth.dto.ApiResponse;
import com.towsoth.entity.AnalyticsData;
import com.towsoth.security.JwtUtil;
import com.towsoth.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/analytics")
@CrossOrigin
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    private final JwtUtil jwtUtil;

    public AnalyticsController(AnalyticsService analyticsService, JwtUtil jwtUtil) {
        this.analyticsService = analyticsService;
        this.jwtUtil = jwtUtil;
    }
    
    @GetMapping("")
    public ResponseEntity<ApiResponse<AnalyticsData>> getAnalytics(
            @RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            Optional<AnalyticsData> analytics = analyticsService.getAnalyticsData(studentId);
            
            if (analytics.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(false, null, "Analytics not found", "Analytics not found", 404)
                );
            }
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, analytics.get(), null, "Analytics retrieved successfully", 200
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ApiResponse<>(false, null, e.getMessage(), "Unauthorized request", 401)
            );
        } catch (Exception e) {
            log.error("Error fetching analytics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch analytics", 500)
            );
        }
    }
    
    @PutMapping("/weekly-progress")
    public ResponseEntity<ApiResponse<AnalyticsData>> updateWeeklyProgress(
            @RequestHeader("Authorization") String token,
            @RequestBody WeeklyProgressRequest request) {
        try {
            String studentId = extractStudentIdFromToken(token);
            AnalyticsData updated = analyticsService.updateWeeklyProgress(
                studentId, request.getHoursSpent()
            );
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, updated, null, "Weekly progress updated successfully", 200
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiResponse<>(false, null, e.getMessage(), "Invalid request", 400)
            );
        } catch (Exception e) {
            log.error("Error updating weekly progress", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to update weekly progress", 500)
            );
        }
    }
    
    @PutMapping("/daily-activity")
    public ResponseEntity<ApiResponse<AnalyticsData>> updateDailyActivity(
            @RequestHeader("Authorization") String token,
            @RequestBody DailyActivityRequest request) {
        try {
            String studentId = extractStudentIdFromToken(token);
            AnalyticsData updated = analyticsService.updateDailyActivity(
                studentId, request.getActivityType()
            );
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, updated, null, "Daily activity updated successfully", 200
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiResponse<>(false, null, e.getMessage(), "Invalid request", 400)
            );
        } catch (Exception e) {
            log.error("Error updating daily activity", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to update daily activity", 500)
            );
        }
    }
    
    @PutMapping("/subject-mastery")
    public ResponseEntity<ApiResponse<AnalyticsData>> updateSubjectMastery(
            @RequestHeader("Authorization") String token,
            @RequestBody SubjectMasteryRequest request) {
        try {
            String studentId = extractStudentIdFromToken(token);
            AnalyticsData updated = analyticsService.updateSubjectMastery(
                studentId, request.getSubject(), request.getMasteryLevel()
            );
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, updated, null, "Subject mastery updated successfully", 200
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiResponse<>(false, null, e.getMessage(), "Invalid request", 400)
            );
        } catch (Exception e) {
            log.error("Error updating subject mastery", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to update subject mastery", 500)
            );
        }
    }
    
    private String extractStudentIdFromToken(String token) {
        if (token == null || token.isBlank()) {
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

        return jwtUtil.extractUserId(actualToken);
    }
    
    public static class WeeklyProgressRequest {
        private Integer hoursSpent;

        public Integer getHoursSpent() {
            return hoursSpent;
        }

        public void setHoursSpent(Integer hoursSpent) {
            this.hoursSpent = hoursSpent;
        }
    }
    
    public static class DailyActivityRequest {
        private String activityType;

        public String getActivityType() {
            return activityType;
        }

        public void setActivityType(String activityType) {
            this.activityType = activityType;
        }
    }
    
    public static class SubjectMasteryRequest {
        private String subject;
        private Integer masteryLevel;

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public Integer getMasteryLevel() {
            return masteryLevel;
        }

        public void setMasteryLevel(Integer masteryLevel) {
            this.masteryLevel = masteryLevel;
        }
    }
}

