package com.towsoth.controller;

import com.towsoth.dto.AIAnalysisResponse;
import com.towsoth.dto.ApiResponse;
import com.towsoth.external.AIService;
import com.towsoth.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/ai")
@CrossOrigin
public class AIController {

    private static final Logger log = LoggerFactory.getLogger(AIController.class);
    
    private final AIService aiService;
    private final JwtUtil jwtUtil;

    public AIController(AIService aiService, JwtUtil jwtUtil) {
        this.aiService = aiService;
        this.jwtUtil = jwtUtil;
    }
    
    @PostMapping("/analyze-performance")
    public Mono<ResponseEntity<ApiResponse<AIAnalysisResponse>>> analyzePerformance(
            @RequestHeader("Authorization") String token,
            @RequestBody PerformanceAnalysisRequest request) {
        try {
            String studentId = extractStudentIdFromToken(token);
            return aiService.analyzeStudentPerformance(studentId, request.getTestSubmissionId())
                .map(analysis -> ResponseEntity.ok(new ApiResponse<>(
                    true, analysis, null, "Performance analysis completed", 200
                )))
                .onErrorResume(error -> {
                    log.error("Error analyzing performance", error);
                    ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(buildResponse(false, null, error.getMessage(), "Failed to analyze performance", 500));
                    return Mono.just(response);
                });
        } catch (IllegalArgumentException e) {
            ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(buildResponse(false, null, e.getMessage(), "Unauthorized request", 401));
            return Mono.just(response);
        } catch (Exception e) {
            log.error("Error in analyze performance endpoint", e);
            ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildResponse(false, null, e.getMessage(), "Failed to analyze performance", 500));
            return Mono.just(response);
        }
    }
    
    @GetMapping("/recommendations")
    public Mono<ResponseEntity<ApiResponse<AIAnalysisResponse>>> getRecommendations(
            @RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            return aiService.getContentRecommendations(studentId)
                .map(recommendations -> ResponseEntity.ok(new ApiResponse<>(
                    true, recommendations, null, "Recommendations retrieved successfully", 200
                )))
                .onErrorResume(error -> {
                    log.error("Error getting recommendations", error);
                    ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(buildResponse(false, null, error.getMessage(), "Failed to get recommendations", 500));
                    return Mono.just(response);
                });
        } catch (IllegalArgumentException e) {
            ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(buildResponse(false, null, e.getMessage(), "Unauthorized request", 401));
            return Mono.just(response);
        } catch (Exception e) {
            log.error("Error in recommendations endpoint", e);
            ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildResponse(false, null, e.getMessage(), "Failed to get recommendations", 500));
            return Mono.just(response);
        }
    }
    
    @GetMapping("/insights")
    public Mono<ResponseEntity<ApiResponse<AIAnalysisResponse>>> getLearningInsights(
            @RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            return aiService.generateLearningInsights(studentId)
                .map(insights -> ResponseEntity.ok(new ApiResponse<>(
                    true, insights, null, "Learning insights generated successfully", 200
                )))
                .onErrorResume(error -> {
                    log.error("Error generating insights", error);
                    ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(buildResponse(false, null, error.getMessage(), "Failed to generate insights", 500));
                    return Mono.just(response);
                });
        } catch (IllegalArgumentException e) {
            ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(buildResponse(false, null, e.getMessage(), "Unauthorized request", 401));
            return Mono.just(response);
        } catch (Exception e) {
            log.error("Error in insights endpoint", e);
            ResponseEntity<ApiResponse<AIAnalysisResponse>> response = ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildResponse(false, null, e.getMessage(), "Failed to generate insights", 500));
            return Mono.just(response);
        }
    }
    
    @GetMapping("/health")
    public Mono<Void> healthCheck() {
        return aiService.healthCheck();
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

    private ApiResponse<AIAnalysisResponse> buildResponse(boolean success,
                                                          AIAnalysisResponse data,
                                                          String error,
                                                          String message,
                                                          int statusCode) {
        ApiResponse<AIAnalysisResponse> response = new ApiResponse<>();
        response.setSuccess(success);
        response.setData(data);
        response.setError(error);
        response.setMessage(message);
        response.setStatusCode(statusCode);
        return response;
    }
    
    public static class PerformanceAnalysisRequest {
        private String testSubmissionId;

        public String getTestSubmissionId() {
            return testSubmissionId;
        }

        public void setTestSubmissionId(String testSubmissionId) {
            this.testSubmissionId = testSubmissionId;
        }
    }
}

