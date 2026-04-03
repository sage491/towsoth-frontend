package com.towsoth.repository;

import com.towsoth.entity.TestSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSubmissionRepository extends MongoRepository<TestSubmission, String> {
    List<TestSubmission> findByStudentId(String studentId);
    List<TestSubmission> findByStudentIdAndTestId(String studentId, String testId);
}

