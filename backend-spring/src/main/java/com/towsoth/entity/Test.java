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
@Table(name = "tests")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Test {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String institution;
    
    @ElementCollection
    private List<Question> questions = new ArrayList<>();
    
    @Column(nullable = false)
    private Integer duration;
    
    @Column(nullable = false)
    private Integer passingScore;
    
    @Column(nullable = false)
    private String difficulty = "medium"; // easy, medium, hard
    
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
    public static class Question {
        private String id;
        @Column(columnDefinition = "TEXT")
        private String text;
        private String type; // multiple-choice, short-answer, essay
        /** Stored as JSON array string (nested @ElementCollection not allowed inside embeddable collections). */
        @Column(columnDefinition = "TEXT")
        private String optionsJson = "[]";
        @Column(columnDefinition = "TEXT")
        private String correctAnswer;
        @Column(columnDefinition = "TEXT")
        private String explanation;
        private Integer marks;
    }
}
