package com.towsoth.service;

import com.towsoth.dto.VideoRecommendationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Delegates to {@link YouTubeRecommendationService} — recommendations are YouTube-only.
 */
@Service
@RequiredArgsConstructor
public class VideoRecommendationService {

    private final YouTubeRecommendationService youTubeRecommendationService;

    public List<VideoRecommendationDto> recommendTop3(List<String> weakConcepts) {
        return youTubeRecommendationService.recommendTop3(weakConcepts);
    }
}
