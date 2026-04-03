package com.towsoth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.towsoth.dto.VideoRecommendationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Fetches real videos from YouTube (Data API v3) only — no local catalog.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class YouTubeRecommendationService {

    private static final double W_RATING = 0.5;
    private static final double W_VIEWS = 0.3;
    private static final double W_COMPLETION = 0.2;
    private static final double VIEWS_CAP = 100_000.0;
    private static final int SEARCH_MAX = 20;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${youtube.api.key:}")
    private String youtubeApiKey;

    public List<VideoRecommendationDto> recommendTop3(List<String> weakConcepts) {
        if (youtubeApiKey == null || youtubeApiKey.isBlank()) {
            throw new IllegalStateException(
                    "YouTube Data API key is not configured. Set environment variable YOUTUBE_API_KEY or property youtube.api.key."
            );
        }

        List<String> terms = weakConcepts.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        if (terms.isEmpty()) {
            throw new IllegalArgumentException("weakConcepts must contain at least one concept");
        }

        String query = String.join(" ", terms) + " tutorial explained";
        if (query.length() > 200) {
            query = query.substring(0, 200);
        }

        List<String> videoIds = searchVideoIds(query);
        if (videoIds.isEmpty()) {
            return List.of();
        }

        List<VideoRecommendationDto> scored = fetchAndScore(videoIds, terms);
        return scored.stream()
                .sorted(Comparator.comparing(VideoRecommendationDto::getScore).reversed())
                .limit(3)
                .collect(Collectors.toList());
    }

    private List<String> searchVideoIds(String q) {
        try {
            String json = webClient.get()
                    .uri(uriBuilder -> searchUri(uriBuilder, q))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            if (json == null) {
                return List.of();
            }
            JsonNode root = objectMapper.readTree(json);
            JsonNode items = root.path("items");
            List<String> ids = new ArrayList<>();
            for (JsonNode item : items) {
                String id = item.path("id").path("videoId").asText(null);
                if (id != null && !id.isEmpty()) {
                    ids.add(id);
                }
            }
            return ids;
        } catch (Exception e) {
            log.error("YouTube search failed", e);
            return List.of();
        }
    }

    private java.net.URI searchUri(UriBuilder uriBuilder, String q) {
        return uriBuilder
                .scheme("https")
                .host("www.googleapis.com")
                .path("/youtube/v3/search")
                .queryParam("part", "snippet")
                .queryParam("type", "video")
                .queryParam("maxResults", SEARCH_MAX)
                .queryParam("safeSearch", "moderate")
                .queryParam("q", q)
                .queryParam("key", youtubeApiKey)
                .build();
    }

    private List<VideoRecommendationDto> fetchAndScore(List<String> videoIds, List<String> originalTerms) {
        List<VideoRecommendationDto> out = new ArrayList<>();
        for (int i = 0; i < videoIds.size(); i += 50) {
            List<String> batch = videoIds.subList(i, Math.min(i + 50, videoIds.size()));
            String idParam = String.join(",", batch);
            try {
                String json = webClient.get()
                        .uri(uriBuilder -> videosUri(uriBuilder, idParam))
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
                if (json == null) {
                    continue;
                }
                JsonNode root = objectMapper.readTree(json);
                for (JsonNode item : root.path("items")) {
                    VideoRecommendationDto dto = mapVideo(item, originalTerms);
                    if (dto != null) {
                        out.add(dto);
                    }
                }
            } catch (Exception e) {
                log.error("YouTube videos.list failed", e);
            }
        }
        return out;
    }

    private java.net.URI videosUri(UriBuilder uriBuilder, String ids) {
        return uriBuilder
                .scheme("https")
                .host("www.googleapis.com")
                .path("/youtube/v3/videos")
                .queryParam("part", "snippet,statistics")
                .queryParam("id", ids)
                .queryParam("key", youtubeApiKey)
                .build();
    }

    private VideoRecommendationDto mapVideo(JsonNode item, List<String> originalTerms) {
        String videoId = item.path("id").asText(null);
        if (videoId == null || videoId.isEmpty()) {
            return null;
        }
        String title = item.path("snippet").path("title").asText("Untitled");
        String channel = item.path("snippet").path("channelTitle").asText("YouTube");

        JsonNode stats = item.path("statistics");
        long views = parseLong(stats.path("viewCount").asText("0"));
        long likes = parseLong(stats.path("likeCount").asText("0"));

        double rating = ratingFromEngagement(likes, views);
        double completion = completionFromEngagement(likes, views);

        double score = computeWeightedScore(rating, views, completion);

        String url = "https://www.youtube.com/watch?v=" + videoId;

        List<String> matched = new ArrayList<>();
        String titleLower = title.toLowerCase(Locale.ROOT);
        for (String t : originalTerms) {
            String tl = t.toLowerCase(Locale.ROOT);
            if (titleLower.contains(tl) || tl.length() > 3 && titleLower.contains(tl.substring(0, Math.min(tl.length(), 8)))) {
                matched.add(t);
            }
        }

        return VideoRecommendationDto.builder()
                .id(null)
                .youtubeVideoId(videoId)
                .title(title)
                .url(url)
                .instructor(channel)
                .rating(round2(rating))
                .views(views)
                .completionRate(round2(completion))
                .score(round2(score))
                .matchedConcepts(matched.isEmpty() ? List.copyOf(originalTerms) : matched.stream().distinct().collect(Collectors.toList()))
                .build();
    }

    /**
     * Same blend as catalog: (rating/5)*0.5 + min(views/cap,1)*0.3 + completion*0.2 → ×100.
     */
    static double computeWeightedScore(double rating0to5, long views, double completion0to1) {
        double r = Math.min(1.0, Math.max(0.0, rating0to5 / 5.0));
        double v = Math.min(1.0, Math.max(0.0, views / VIEWS_CAP));
        double c = Math.min(1.0, Math.max(0.0, completion0to1));
        return (r * W_RATING + v * W_VIEWS + c * W_COMPLETION) * 100.0;
    }

    /** Like-to-view ratio scaled to 0–5 stars (YouTube does not expose star ratings). */
    private static double ratingFromEngagement(long likes, long views) {
        if (views <= 0) {
            return 3.0;
        }
        double ratio = (double) likes / (double) views;
        return Math.min(5.0, Math.max(1.0, ratio * 500.0));
    }

    /** Engagement proxy for “completion” (0–1). */
    private static double completionFromEngagement(long likes, long views) {
        if (views <= 0) {
            return 0.5;
        }
        return Math.min(1.0, (double) likes / (double) views * 25.0);
    }

    private static long parseLong(String s) {
        try {
            return Long.parseLong(s);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
