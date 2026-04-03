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
@Table(name = "user_profiles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false)
    private String role = "student"; // student or admin
    
    private String institution;
    
    // Student-specific fields (optional for admin)
    @ElementCollection
    private List<String> enrolledSubjects = new ArrayList<>();
    
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer totalScore = 0;
    
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer rank = 0;
    
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer streakDays = 0;
    
    @Column(columnDefinition = "INTEGER DEFAULT 1")
    private Integer unlockLevel = 1;
    
    @ElementCollection
    private List<String> completedTests = new ArrayList<>();
    
    @Embedded
    private UserPreferences preferences;
    
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
    public static class UserPreferences {
        private String motivationTone = "motivational"; // encouragement, friendly, motivational
        private Boolean notificationsEnabled = true;
        private Boolean darkMode = false;
    }
    
    // Helper methods
    public boolean isStudent() {
        return "student".equals(role);
    }

    public boolean isAdmin() {
        return "admin".equals(role);
    }
}
