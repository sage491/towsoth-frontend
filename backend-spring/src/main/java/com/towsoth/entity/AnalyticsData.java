package com.towsoth.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "analytics_data")
public class AnalyticsData {
    
    @Id
    private String id;
    
    private String studentId;
    private List<WeeklyProgress> weeklyProgress;
    private List<SubjectMastery> subjectMastery;
    private List<ActivityDistribution> activityDistribution;
    private List<DailyActivity> dailyActivity;
    private List<ConceptProgress> conceptProgress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyProgress {
        private String week;
        private Integer progress;
        private Integer tasksCompleted;
        private Integer hoursSpent;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectMastery {
        private String subject;
        private Integer mastery;
        private Integer practiceScore;
        private Integer conceptsLearned;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityDistribution {
        private String type;
        private Integer percentage;
        private Integer hours;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyActivity {
        private String date;
        private Integer activity;
        private String type;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConceptProgress {
        private String conceptName;
        private Integer progress;
        private String status; // not-started, in-progress, completed, mastered
        private Integer daysActive;
    }
}

