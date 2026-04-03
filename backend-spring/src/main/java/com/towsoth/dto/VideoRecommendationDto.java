package com.towsoth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoRecommendationDto {
    private Long id;
    /** Present when source is YouTube Data API */
    private String youtubeVideoId;
    private String title;
    /** Always a https://www.youtube.com/watch?v=… URL when using YouTube API */
    private String url;
    private String instructor;
    private Double rating;
    private Long views;
    /** 0.0–1.0 */
    private Double completionRate;
    /**
     * Weighted score on 0–100: ((rating/5)×0.5 + min(views/cap,1)×0.3 + completion×0.2) × 100
     */
    private Double score;
    private List<String> matchedConcepts;
}
