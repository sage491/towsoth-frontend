package com.towsoth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subjects")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Subject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String institution;
    
    @ElementCollection
    private List<Chapter> chapters = new ArrayList<>();
    
    @ElementCollection
    private List<Resource> resources = new ArrayList<>();
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Chapter {
        private String id;
        private String title;
        private String description;
        @Column(name = "chapter_order")
        private Integer chapterOrder;
        /** JSON array of concept strings (nested @ElementCollection not allowed inside embeddable collections). */
        @Column(columnDefinition = "TEXT")
        private String conceptsJson = "[]";
        private Integer estimatedHours;
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Resource {
        private String id;
        private String title;
        private String type; // video, article, pdf, interactive
        private String url;
        private String difficulty; // beginner, intermediate, advanced
        private Integer duration;
    }
}
