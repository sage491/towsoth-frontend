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
@Document(collection = "test_submissions")
public class TestSubmission {
    
    @Id
    private String id;
    
    private String studentId;
    private String testId;
    private List<Answer> answers;
    private Integer score;
    private Integer totalMarks;
    private Boolean passedStatus;
    private Integer duration;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Answer {
        private String questionId;
        private Object answer;
    }
}

