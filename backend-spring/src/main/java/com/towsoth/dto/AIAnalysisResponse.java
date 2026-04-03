package com.towsoth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResponse {
    private List<String> insights;
    private List<ContentRecommendation> recommendations;
    private PerformanceMetrics performanceMetrics;
    private List<String> nextSteps;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentRecommendation {
        private String resourceId;
        private String title;
        private String reason;
        private String priority; // high, medium, low
        private Integer estimatedDuration;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PerformanceMetrics {
        private Integer overallScore;
        private List<String> strongAreas;
        private List<String> weakAreas;
        private Integer estimatedImprovementPotential;
    }
}

