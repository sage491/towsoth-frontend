package com.towsoth.repository;

import com.towsoth.entity.AnalyticsData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalyticsDataRepository extends MongoRepository<AnalyticsData, String> {
    Optional<AnalyticsData> findByStudentId(String studentId);
}

