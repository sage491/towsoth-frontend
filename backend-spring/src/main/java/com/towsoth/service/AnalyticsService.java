package com.towsoth.service;

import com.towsoth.entity.AnalyticsData;
import com.towsoth.repository.AnalyticsDataRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);
    
    private final AnalyticsDataRepository analyticsDataRepository;
    
    public Optional<AnalyticsData> getAnalyticsData(String studentId) {
        validateStudentId(studentId);
        log.info("Fetching analytics data for student: {}", studentId);
        
        Optional<AnalyticsData> analytics = analyticsDataRepository.findByStudentId(studentId);
        
        if (analytics.isEmpty()) {
            log.info("Creating default analytics for student: {}", studentId);
            AnalyticsData newAnalytics = new AnalyticsData();
            newAnalytics.setStudentId(studentId);
            initializeCollections(newAnalytics);
            newAnalytics.setCreatedAt(LocalDateTime.now());
            newAnalytics.setUpdatedAt(LocalDateTime.now());
            
            AnalyticsData saved = analyticsDataRepository.save(newAnalytics);
            return Optional.of(saved);
        }

        AnalyticsData existing = analytics.get();
        initializeCollections(existing);
        return Optional.of(existing);
    }
    
    public AnalyticsData updateWeeklyProgress(String studentId, Integer hoursSpent) {
        validateStudentId(studentId);
        validateHoursSpent(hoursSpent);
        log.info("Updating weekly progress for student: {}", studentId);
        
        AnalyticsData analytics = analyticsDataRepository.findByStudentId(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Analytics not found"));
        initializeCollections(analytics);
        
        LocalDate today = LocalDate.now();
        int week = (today.getDayOfMonth() - 1) / 7 + 1;
        String weekKey = "Week " + week;
        
        Optional<AnalyticsData.WeeklyProgress> existingWeek = analytics.getWeeklyProgress()
            .stream()
            .filter(w -> w.getWeek().equals(weekKey))
            .findFirst();
        
        if (existingWeek.isPresent()) {
            existingWeek.get().setHoursSpent(existingWeek.get().getHoursSpent() + hoursSpent);
            existingWeek.get().setTasksCompleted(existingWeek.get().getTasksCompleted() + 1);
            existingWeek.get().setProgress(Math.min(100, existingWeek.get().getProgress() + 10));
        } else {
            AnalyticsData.WeeklyProgress newWeek = new AnalyticsData.WeeklyProgress();
            newWeek.setWeek(weekKey);
            newWeek.setProgress(10);
            newWeek.setTasksCompleted(1);
            newWeek.setHoursSpent(hoursSpent);
            analytics.getWeeklyProgress().add(newWeek);
        }
        
        analytics.setUpdatedAt(LocalDateTime.now());
        return analyticsDataRepository.save(analytics);
    }
    
    public AnalyticsData updateDailyActivity(String studentId, String activityType) {
        validateStudentId(studentId);
        validateActivityType(activityType);
        log.info("Updating daily activity for student: {}", studentId);
        
        AnalyticsData analytics = analyticsDataRepository.findByStudentId(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Analytics not found"));
        initializeCollections(analytics);
        
        String today = LocalDate.now().toString();
        
        Optional<AnalyticsData.DailyActivity> existingDay = analytics.getDailyActivity()
            .stream()
            .filter(d -> d.getDate().equals(today))
            .findFirst();
        
        if (existingDay.isPresent()) {
            existingDay.get().setActivity(existingDay.get().getActivity() + 1);
        } else {
            AnalyticsData.DailyActivity newDay = new AnalyticsData.DailyActivity();
            newDay.setDate(today);
            newDay.setActivity(1);
            newDay.setType(activityType);
            analytics.getDailyActivity().add(newDay);
        }
        
        analytics.setUpdatedAt(LocalDateTime.now());
        return analyticsDataRepository.save(analytics);
    }
    
    public AnalyticsData updateSubjectMastery(String studentId, String subject, Integer masteryLevel) {
        validateStudentId(studentId);
        validateSubject(subject);
        validateMasteryLevel(masteryLevel);
        log.info("Updating subject mastery for student {} in subject {}", studentId, subject);
        
        AnalyticsData analytics = analyticsDataRepository.findByStudentId(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Analytics not found"));
        initializeCollections(analytics);
        
        Optional<AnalyticsData.SubjectMastery> existingSubject = analytics.getSubjectMastery()
            .stream()
            .filter(s -> s.getSubject().equals(subject))
            .findFirst();
        
        if (existingSubject.isPresent()) {
            existingSubject.get().setMastery(Math.max(masteryLevel, existingSubject.get().getMastery()));
        } else {
            AnalyticsData.SubjectMastery newSubject = new AnalyticsData.SubjectMastery();
            newSubject.setSubject(subject);
            newSubject.setMastery(masteryLevel);
            newSubject.setPracticeScore(0);
            newSubject.setConceptsLearned(0);
            analytics.getSubjectMastery().add(newSubject);
        }
        
        analytics.setUpdatedAt(LocalDateTime.now());
        return analyticsDataRepository.save(analytics);
    }

    private void initializeCollections(AnalyticsData analytics) {
        if (analytics.getWeeklyProgress() == null) {
            analytics.setWeeklyProgress(new ArrayList<>());
        }
        if (analytics.getDailyActivity() == null) {
            analytics.setDailyActivity(new ArrayList<>());
        }
        if (analytics.getSubjectMastery() == null) {
            analytics.setSubjectMastery(new ArrayList<>());
        }
        if (analytics.getActivityDistribution() == null) {
            analytics.setActivityDistribution(new ArrayList<>());
        }
        if (analytics.getConceptProgress() == null) {
            analytics.setConceptProgress(new ArrayList<>());
        }
    }

    private void validateStudentId(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            throw new IllegalArgumentException("Student ID is required");
        }
    }

    private void validateHoursSpent(Integer hoursSpent) {
        if (hoursSpent == null || hoursSpent < 0) {
            throw new IllegalArgumentException("hoursSpent must be a non-negative value");
        }
    }

    private void validateActivityType(String activityType) {
        if (activityType == null || activityType.isBlank()) {
            throw new IllegalArgumentException("activityType is required");
        }
    }

    private void validateSubject(String subject) {
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("subject is required");
        }
    }

    private void validateMasteryLevel(Integer masteryLevel) {
        if (masteryLevel == null || masteryLevel < 0 || masteryLevel > 100) {
            throw new IllegalArgumentException("masteryLevel must be between 0 and 100");
        }
    }
}

