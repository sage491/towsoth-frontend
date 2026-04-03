package com.towsoth.controller;

import com.towsoth.dto.ApiResponse;
import com.towsoth.entity.Test;
import com.towsoth.entity.TestSubmission;
import com.towsoth.security.JwtUtil;
import com.towsoth.service.TestService;
import com.towsoth.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tests")
@CrossOrigin
public class TestController {

    private static final Logger log = LoggerFactory.getLogger(TestController.class);
    
    private final TestService testService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public TestController(TestService testService, JwtUtil jwtUtil, UserService userService) {
        this.testService = testService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<Test>>> getTestsBySubject(
            @PathVariable String subjectId,
            @RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            String institution = resolveStudentInstitution(studentId);
            List<Test> tests = testService.getTestsBySubjectAndInstitution(subjectId, institution);
            return ResponseEntity.ok(new ApiResponse<>(
                true, tests, null, "Tests retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching tests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch tests", 500)
            );
        }
    }
    
    @GetMapping("/{testId}")
    public ResponseEntity<ApiResponse<Test>> getTestById(
            @PathVariable String testId,
            @RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            String institution = resolveStudentInstitution(studentId);
            Optional<Test> test = testService.getTestByIdAndInstitution(testId, institution);
            
            if (test.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(false, null, "Test not found", "Test not found", 404)
                );
            }
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, test.get(), null, "Test retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch test", 500)
            );
        }
    }
    
    @PostMapping("/{testId}/submit")
    public ResponseEntity<ApiResponse<TestSubmission>> submitTest(
            @PathVariable String testId,
            @RequestHeader("Authorization") String token,
            @RequestBody TestSubmitRequest request) {
        try {
            String studentId = extractStudentIdFromToken(token);
            TestSubmission submission = testService.submitTest(
                studentId, testId, request.getAnswers(), request.getDuration()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true, submission, null, "Test submitted successfully", 201
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ApiResponse<>(false, null, e.getMessage(), "Unauthorized request", 401)
            );
        } catch (Exception e) {
            log.error("Error submitting test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to submit test", 500)
            );
        }
    }
    
    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<ApiResponse<TestSubmission>> getSubmission(
            @PathVariable String submissionId,
            @RequestHeader("Authorization") String token) {
        try {
            String studentId = extractStudentIdFromToken(token);
            Optional<TestSubmission> submission = testService.getTestSubmissionByIdForStudent(submissionId, studentId);
            
            if (submission.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(false, null, "Submission not found", "Submission not found", 404)
                );
            }
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, submission.get(), null, "Submission retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching submission", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch submission", 500)
            );
        }
    }
    
    private String extractStudentIdFromToken(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token is missing");
        }

        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        if (!jwtUtil.validateToken(actualToken)) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        String role = jwtUtil.extractRole(actualToken);
        if (!"STUDENT".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Access denied: student role required");
        }

        return jwtUtil.extractUserId(actualToken);
    }

    private String resolveStudentInstitution(String studentId) {
        String institution = userService.getUserById(studentId).getInstitution();
        if (institution == null || institution.isBlank()) {
            throw new IllegalArgumentException("Student institution is not configured");
        }
        return institution;
    }
    
    public static class TestSubmitRequest {
        private List<TestSubmission.Answer> answers;
        private Integer duration;

        public List<TestSubmission.Answer> getAnswers() {
            return answers;
        }

        public void setAnswers(List<TestSubmission.Answer> answers) {
            this.answers = answers;
        }

        public Integer getDuration() {
            return duration;
        }

        public void setDuration(Integer duration) {
            this.duration = duration;
        }
    }
}

