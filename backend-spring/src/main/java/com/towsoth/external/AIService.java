package com.towsoth.external;

import com.towsoth.config.AppConfig;
import com.towsoth.dto.AIAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {
    
    private final WebClient webClient;
    private final AppConfig appConfig;
    
    public Mono<AIAnalysisResponse> analyzeStudentPerformance(String studentId, String testSubmissionId) {
        log.info("Analyzing performance for student: {}", studentId);
        
        Map<String, Object> request = new HashMap<>();
        request.put("studentId", studentId);
        request.put("testSubmissionId", testSubmissionId);
        request.put("actionType", "analyze-performance");
        
        return webClient.post()
            .uri(appConfig.aiServerUrl + "/api/analyze-performance")
            .header("Authorization", "Bearer " + appConfig.aiApiKey)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(AIAnalysisResponse.class)
            .doOnError(error -> log.error("Failed to analyze performance", error));
    }
    
    public Mono<AIAnalysisResponse> getContentRecommendations(String studentId) {
        log.info("Getting content recommendations for student: {}", studentId);
        
        Map<String, Object> request = new HashMap<>();
        request.put("studentId", studentId);
        request.put("actionType", "recommend-content");
        
        return webClient.post()
            .uri(appConfig.aiServerUrl + "/api/recommend-content")
            .header("Authorization", "Bearer " + appConfig.aiApiKey)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(AIAnalysisResponse.class)
            .doOnError(error -> log.error("Failed to get recommendations", error));
    }
    
    public Mono<AIAnalysisResponse> generateLearningInsights(String studentId) {
        log.info("Generating learning insights for student: {}", studentId);
        
        Map<String, Object> request = new HashMap<>();
        request.put("studentId", studentId);
        request.put("actionType", "generate-insights");
        
        return webClient.post()
            .uri(appConfig.aiServerUrl + "/api/generate-insights")
            .header("Authorization", "Bearer " + appConfig.aiApiKey)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(AIAnalysisResponse.class)
            .doOnError(error -> log.error("Failed to generate insights", error));
    }
    
    public Mono<Void> healthCheck() {
        log.info("Checking AI server health");
        
        return webClient.get()
            .uri(appConfig.aiServerUrl + "/health")
            .retrieve()
            .bodyToMono(Void.class)
            .doOnSuccess(v -> log.info("AI server health check passed"))
            .doOnError(error -> log.warn("AI server health check failed"));
    }
}

