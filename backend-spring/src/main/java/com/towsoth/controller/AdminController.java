package com.towsoth.controller;

import com.towsoth.dto.ApiResponse;
import com.towsoth.entity.UserProfile;
import com.towsoth.entity.Subject;
import com.towsoth.entity.Test;
import com.towsoth.service.UserService;
import com.towsoth.repository.SubjectRepository;
import com.towsoth.repository.TestRepository;
import com.towsoth.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final UserService userService;
    private final SubjectRepository subjectRepository;
    private final TestRepository testRepository;
    private final JwtUtil jwtUtil;

    public AdminController(
            UserService userService,
            SubjectRepository subjectRepository,
            TestRepository testRepository,
            JwtUtil jwtUtil
    ) {
        this.userService = userService;
        this.subjectRepository = subjectRepository;
        this.testRepository = testRepository;
        this.jwtUtil = jwtUtil;
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfile>>> getAllUsers(@RequestHeader("Authorization") String token) {
        try {
            UserProfile admin = resolveAdmin(token);

            List<UserProfile> users = userService.getAllUsersByInstitution(admin.getInstitution());
            return ResponseEntity.ok(new ApiResponse<>(
                true, users, null, "Users retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch users", 500)
            );
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserProfile>> getUserById(
            @RequestHeader("Authorization") String token,
            @PathVariable String userId) {
        try {
            UserProfile admin = resolveAdmin(token);

            UserProfile user = userService.getUserByIdInInstitution(userId, admin.getInstitution());
            return ResponseEntity.ok(new ApiResponse<>(
                true, user, null, "User retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch user", 500)
            );
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserProfile>> updateUser(
            @RequestHeader("Authorization") String token,
            @PathVariable String userId,
            @RequestBody UserProfile updatedProfile) {
        try {
            UserProfile admin = resolveAdmin(token);

            UserProfile updated = userService.updateUserInInstitution(userId, admin.getInstitution(), updatedProfile);
            return ResponseEntity.ok(new ApiResponse<>(
                true, updated, null, "User updated successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error updating user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to update user", 500)
            );
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @RequestHeader("Authorization") String token,
            @PathVariable String userId) {
        try {
            UserProfile admin = resolveAdmin(token);

            userService.deleteUserInInstitution(userId, admin.getInstitution());
            return ResponseEntity.ok(new ApiResponse<>(
                true, null, null, "User deleted successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error deleting user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to delete user", 500)
            );
        }
    }

    // Subject Management
    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<Subject>>> getAllSubjects(@RequestHeader("Authorization") String token) {
        try {
            UserProfile admin = resolveAdmin(token);

            List<Subject> subjects = subjectRepository.findByInstitution(admin.getInstitution());
            return ResponseEntity.ok(new ApiResponse<>(
                true, subjects, null, "Subjects retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching subjects", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch subjects", 500)
            );
        }
    }

    @PostMapping("/subjects")
    public ResponseEntity<ApiResponse<Subject>> createSubject(
            @RequestHeader("Authorization") String token,
            @RequestBody Subject subject) {
        try {
            UserProfile admin = resolveAdmin(token);

            subject.setInstitution(admin.getInstitution());

            Subject saved = subjectRepository.save(subject);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true, saved, null, "Subject created successfully", 201
            ));
        } catch (Exception e) {
            log.error("Error creating subject", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to create subject", 500)
            );
        }
    }

    @PutMapping("/subjects/{subjectId}")
    public ResponseEntity<ApiResponse<Subject>> updateSubject(
            @RequestHeader("Authorization") String token,
            @PathVariable String subjectId,
            @RequestBody Subject updatedSubject) {
        try {
            UserProfile admin = resolveAdmin(token);

            Long id = parsePathLong(subjectId, "subject");
            Subject existing = subjectRepository.findByIdAndInstitution(id, admin.getInstitution())
                    .orElseThrow(() -> new IllegalArgumentException("Subject not found in institution"));

            existing.setName(updatedSubject.getName());
            existing.setCode(updatedSubject.getCode());
            existing.setDescription(updatedSubject.getDescription());
            existing.setChapters(updatedSubject.getChapters());
            existing.setResources(updatedSubject.getResources());
            existing.setInstitution(admin.getInstitution());

            Subject saved = subjectRepository.save(existing);
            return ResponseEntity.ok(new ApiResponse<>(
                true, saved, null, "Subject updated successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error updating subject", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to update subject", 500)
            );
        }
    }

    @DeleteMapping("/subjects/{subjectId}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(
            @RequestHeader("Authorization") String token,
            @PathVariable String subjectId) {
        try {
            UserProfile admin = resolveAdmin(token);

            Long id = parsePathLong(subjectId, "subject");
            Subject existing = subjectRepository.findByIdAndInstitution(id, admin.getInstitution())
                    .orElseThrow(() -> new IllegalArgumentException("Subject not found in institution"));
            subjectRepository.deleteById(existing.getId());
            return ResponseEntity.ok(new ApiResponse<>(
                true, null, null, "Subject deleted successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error deleting subject", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to delete subject", 500)
            );
        }
    }

    // Test Management
    @GetMapping("/tests")
    public ResponseEntity<ApiResponse<List<Test>>> getAllTests(@RequestHeader("Authorization") String token) {
        try {
            UserProfile admin = resolveAdmin(token);

            List<Test> tests = testRepository.findByInstitution(admin.getInstitution());
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

    @PostMapping("/tests")
    public ResponseEntity<ApiResponse<Test>> createTest(
            @RequestHeader("Authorization") String token,
            @RequestBody Test test) {
        try {
            UserProfile admin = resolveAdmin(token);

            enforceSubjectOwnership(test.getSubject(), admin.getInstitution());
            test.setInstitution(admin.getInstitution());

            Test saved = testRepository.save(test);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true, saved, null, "Test created successfully", 201
            ));
        } catch (Exception e) {
            log.error("Error creating test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to create test", 500)
            );
        }
    }

    @PutMapping("/tests/{testId}")
    public ResponseEntity<ApiResponse<Test>> updateTest(
            @RequestHeader("Authorization") String token,
            @PathVariable String testId,
            @RequestBody Test updatedTest) {
        try {
            UserProfile admin = resolveAdmin(token);

            Long id = parsePathLong(testId, "test");
            Test existing = testRepository.findByIdAndInstitution(id, admin.getInstitution())
                    .orElseThrow(() -> new IllegalArgumentException("Test not found in institution"));

            enforceSubjectOwnership(updatedTest.getSubject(), admin.getInstitution());

            existing.setName(updatedTest.getName());
            existing.setDescription(updatedTest.getDescription());
            existing.setSubject(updatedTest.getSubject());
            existing.setQuestions(updatedTest.getQuestions());
            existing.setDuration(updatedTest.getDuration());
            existing.setPassingScore(updatedTest.getPassingScore());
            existing.setDifficulty(updatedTest.getDifficulty());
            existing.setInstitution(admin.getInstitution());

            Test saved = testRepository.save(existing);
            return ResponseEntity.ok(new ApiResponse<>(
                true, saved, null, "Test updated successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error updating test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to update test", 500)
            );
        }
    }

    @DeleteMapping("/tests/{testId}")
    public ResponseEntity<ApiResponse<Void>> deleteTest(
            @RequestHeader("Authorization") String token,
            @PathVariable String testId) {
        try {
            UserProfile admin = resolveAdmin(token);

            Long id = parsePathLong(testId, "test");
            Test existing = testRepository.findByIdAndInstitution(id, admin.getInstitution())
                    .orElseThrow(() -> new IllegalArgumentException("Test not found in institution"));
            testRepository.deleteById(existing.getId());
            return ResponseEntity.ok(new ApiResponse<>(
                true, null, null, "Test deleted successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error deleting test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to delete test", 500)
            );
        }
    }

    // Analytics Overview
    @GetMapping("/analytics/overview")
    public ResponseEntity<ApiResponse<AdminAnalyticsOverview>> getAnalyticsOverview(@RequestHeader("Authorization") String token) {
        try {
            UserProfile admin = resolveAdmin(token);
            String institution = admin.getInstitution();

            List<UserProfile> scopedUsers = userService.getAllUsersByInstitution(institution);

            // Get basic stats
            long totalUsers = scopedUsers.size();
            long totalStudents = scopedUsers.stream().filter(UserProfile::isStudent).count();
            long totalAdmins = scopedUsers.stream().filter(UserProfile::isAdmin).count();
            long totalSubjects = subjectRepository.countByInstitution(institution);
            long totalTests = testRepository.countByInstitution(institution);

            AdminAnalyticsOverview overview = new AdminAnalyticsOverview();
            overview.setTotalUsers(totalUsers);
            overview.setTotalStudents(totalStudents);
            overview.setTotalAdmins(totalAdmins);
            overview.setTotalSubjects(totalSubjects);
            overview.setTotalTests(totalTests);

            return ResponseEntity.ok(new ApiResponse<>(
                true, overview, null, "Analytics overview retrieved successfully", 200
            ));
        } catch (Exception e) {
            log.error("Error fetching analytics overview", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(false, null, e.getMessage(), "Failed to fetch analytics overview", 500)
            );
        }
    }

    private static long parsePathLong(String value, String name) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid " + name + " id");
        }
    }

    private String extractUserIdFromToken(String token) {
        try {
            if (token == null || token.isBlank()) {
                throw new IllegalArgumentException("Token is missing");
            }

            String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            if (!jwtUtil.validateToken(actualToken)) {
                throw new IllegalArgumentException("Invalid or expired token");
            }

            String role = jwtUtil.extractRole(actualToken);
            String normalizedRole = role == null ? "" : role.trim().toUpperCase();
            if (!("ADMIN".equals(normalizedRole)
                    || "INSTITUTION_ADMIN".equals(normalizedRole)
                    || "SUPER_ADMIN".equals(normalizedRole))) {
                throw new IllegalArgumentException("Access denied: admin role required");
            }

            String userId = jwtUtil.extractUserId(actualToken);

            if (userId == null || userId.isBlank()) {
                throw new IllegalArgumentException("Invalid token format");
            }

            return userId;
        } catch (Exception e) {
            log.error("Error extracting user ID from token: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }

    private UserProfile resolveAdmin(String token) {
        String adminId = extractUserIdFromToken(token);
        return validateAdminRole(adminId);
    }

    private UserProfile validateAdminRole(String userId) {
        try {
            UserProfile user = userService.getUserById(userId);
            
            if (user == null) {
                throw new IllegalArgumentException("User not found");
            }
            
            if (!user.isAdmin()) {
                throw new IllegalArgumentException("User is not an admin");
            }

            if (user.getInstitution() == null || user.getInstitution().isBlank()) {
                throw new IllegalArgumentException("Admin institution is not configured");
            }

            return user;
        } catch (Exception e) {
            log.error("Admin validation failed for user {}: {}", userId, e.getMessage());
            throw new IllegalArgumentException("Admin access denied: " + e.getMessage());
        }
    }

    private void enforceSubjectOwnership(String subjectId, String institution) {
        if (subjectId == null || subjectId.isBlank()) {
            throw new IllegalArgumentException("Subject is required");
        }

        Long sid;
        try {
            sid = Long.parseLong(subjectId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Subject id must be numeric and institution-scoped");
        }

        subjectRepository.findByIdAndInstitution(sid, institution)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found in institution"));
    }

    public static class AdminAnalyticsOverview {
        private long totalUsers;
        private long totalStudents;
        private long totalAdmins;
        private long totalSubjects;
        private long totalTests;

        public long getTotalUsers() {
            return totalUsers;
        }

        public void setTotalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
        }

        public long getTotalStudents() {
            return totalStudents;
        }

        public void setTotalStudents(long totalStudents) {
            this.totalStudents = totalStudents;
        }

        public long getTotalAdmins() {
            return totalAdmins;
        }

        public void setTotalAdmins(long totalAdmins) {
            this.totalAdmins = totalAdmins;
        }

        public long getTotalSubjects() {
            return totalSubjects;
        }

        public void setTotalSubjects(long totalSubjects) {
            this.totalSubjects = totalSubjects;
        }

        public long getTotalTests() {
            return totalTests;
        }

        public void setTotalTests(long totalTests) {
            this.totalTests = totalTests;
        }
    }
}
