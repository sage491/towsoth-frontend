package com.towsoth.controller;

import com.towsoth.dto.ApiResponse;
import com.towsoth.dto.VideoRecommendationDto;
import com.towsoth.dto.WeakConceptsRequest;
import com.towsoth.security.JwtUtil;
import com.towsoth.service.VideoRecommendationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/recommendations")
@CrossOrigin
public class VideoRecommendationController {

    private static final Logger log = LoggerFactory.getLogger(VideoRecommendationController.class);

    private final VideoRecommendationService videoRecommendationService;
    private final JwtUtil jwtUtil;

    public VideoRecommendationController(VideoRecommendationService videoRecommendationService, JwtUtil jwtUtil) {
        this.videoRecommendationService = videoRecommendationService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Returns top 3 videos for the given weak concepts, ranked by weighted blend
     * (rating×0.5 + views×0.3 + completion_rate×0.2) on normalized 0–1 inputs — see service Javadoc.
     */
    @PostMapping("/videos")
    public ResponseEntity<ApiResponse<List<VideoRecommendationDto>>> recommendVideos(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody WeakConceptsRequest body) {
        try {
            extractStudentIdFromToken(token);
            List<VideoRecommendationDto> top = videoRecommendationService.recommendTop3(body.getWeakConcepts());
            return ResponseEntity.ok(new ApiResponse<>(
                    true, top, null, "Top 3 YouTube video recommendations", 200
            ));
        } catch (IllegalStateException e) {
            log.warn("YouTube recommendations unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
                    new ApiResponse<>(false, null, e.getMessage(), "YouTube API not configured", 503)
            );
        } catch (Exception e) {
            log.error("Error recommending videos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(false, null, e.getMessage(), "Failed to recommend videos", 500)
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
        String studentId = jwtUtil.extractUserId(actualToken);
        if (studentId == null || studentId.isBlank()) {
            throw new IllegalArgumentException("Invalid token format");
        }
        return studentId;
    }
}
