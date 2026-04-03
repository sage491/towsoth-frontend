package com.towsoth.service;

import com.towsoth.entity.Test;
import com.towsoth.entity.TestSubmission;
import com.towsoth.repository.TestRepository;
import com.towsoth.repository.TestSubmissionRepository;
import com.towsoth.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TestService {

    private static final Logger log = LoggerFactory.getLogger(TestService.class);
    
    private final TestRepository testRepository;
    private final TestSubmissionRepository testSubmissionRepository;
    private final UserProfileRepository userProfileRepository;

    public TestService(
            TestRepository testRepository,
            TestSubmissionRepository testSubmissionRepository,
            UserProfileRepository userProfileRepository
    ) {
        this.testRepository = testRepository;
        this.testSubmissionRepository = testSubmissionRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public List<Test> getTestsBySubjectAndInstitution(String subjectId, String institution) {
        log.info("Fetching tests for subject {} in institution {}", subjectId, institution);
        return testRepository.findBySubjectAndInstitution(subjectId, institution);
    }

    public Optional<Test> getTestByIdAndInstitution(String testId, String institution) {
        log.info("Fetching test {} in institution {}", testId, institution);
        try {
            return testRepository.findByIdAndInstitution(Long.parseLong(testId), institution);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }
    
    public TestSubmission submitTest(String studentId, String testId, 
                                     List<TestSubmission.Answer> answers, Integer duration) {
        log.info("Processing test submission for student {} on test {}", studentId, testId);
        
        long tid;
        try {
            tid = Long.parseLong(testId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid test id");
        }
        Test test = testRepository.findById(tid)
            .orElseThrow(() -> new IllegalArgumentException("Test not found"));

        String studentInstitution;
        try {
            studentInstitution = userProfileRepository.findById(Long.parseLong(studentId))
                .orElseThrow(() -> new IllegalArgumentException("Student not found"))
                .getInstitution();
        } catch (NumberFormatException e) {
            studentInstitution = userProfileRepository.findByEmail(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"))
                .getInstitution();
        }
        if (studentInstitution == null || studentInstitution.isBlank()) {
            throw new IllegalArgumentException("Student institution is not configured");
        }
        if (test.getInstitution() == null || !studentInstitution.equals(test.getInstitution())) {
            throw new IllegalArgumentException("Test does not belong to student's institution");
        }
        
        // Calculate score
        int score = 0;
        int totalMarks = test.getQuestions().stream()
            .mapToInt(Test.Question::getMarks)
            .sum();
        
        for (TestSubmission.Answer answer : answers) {
            Optional<Test.Question> question = test.getQuestions().stream()
                .filter(q -> q.getId().equals(answer.getQuestionId()))
                .findFirst();
            
            if (question.isPresent()) {
                Test.Question q = question.get();
                if (isAnswerCorrect(q.getCorrectAnswer(), answer.getAnswer())) {
                    score += q.getMarks();
                }
            }
        }
        
        boolean passedStatus = score >= test.getPassingScore();
        
        TestSubmission submission = new TestSubmission();
        submission.setStudentId(studentId);
        submission.setTestId(testId);
        submission.setAnswers(answers);
        submission.setScore(score);
        submission.setTotalMarks(totalMarks);
        submission.setPassedStatus(passedStatus);
        submission.setDuration(duration);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setCreatedAt(LocalDateTime.now());
        submission.setUpdatedAt(LocalDateTime.now());
        
        return testSubmissionRepository.save(submission);
    }
    
    public List<TestSubmission> getStudentTestSubmissions(String studentId) {
        log.info("Fetching test submissions for student: {}", studentId);
        return testSubmissionRepository.findByStudentId(studentId);
    }
    
    public Optional<TestSubmission> getTestSubmissionByIdForStudent(String submissionId, String studentId) {
        log.info("Fetching submission {} for student {}", submissionId, studentId);
        return testSubmissionRepository.findById(submissionId)
                .filter(submission -> studentId.equals(submission.getStudentId()));
    }
    
    private boolean isAnswerCorrect(Object correctAnswer, Object studentAnswer) {
        if (correctAnswer == null || studentAnswer == null) {
            return false;
        }
        return Objects.equals(correctAnswer.toString(), studentAnswer.toString());
    }
}

