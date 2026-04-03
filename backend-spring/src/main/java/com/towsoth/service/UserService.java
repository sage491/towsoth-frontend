package com.towsoth.service;

import com.towsoth.entity.UserProfile;
import com.towsoth.repository.UserProfileRepository;
import com.towsoth.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    
    private final UserProfileRepository userProfileRepository;
    private final SubjectRepository subjectRepository;

    public UserService(UserProfileRepository userProfileRepository, SubjectRepository subjectRepository) {
        this.userProfileRepository = userProfileRepository;
        this.subjectRepository = subjectRepository;
    }

    private Optional<UserProfile> findProfile(String userIdOrEmail) {
        if (userIdOrEmail == null || userIdOrEmail.isBlank()) {
            return Optional.empty();
        }
        try {
            return userProfileRepository.findById(Long.parseLong(userIdOrEmail.trim()));
        } catch (NumberFormatException e) {
            return userProfileRepository.findByEmail(userIdOrEmail.trim());
        }
    }
    
    public Optional<UserProfile> getUserProfile(String userId) {
        log.info("Fetching user profile: {}", userId);
        return findProfile(userId);
    }
    
    public UserProfile getStudentDashboard(String studentId) {
        log.info("Fetching dashboard for student: {}", studentId);
        UserProfile profile = findProfile(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        
        if (!profile.isStudent()) {
            throw new IllegalArgumentException("User is not a student");
        }
        
        return profile;
    }
    
    public List<UserProfile> getEnrolledSubjectsForStudent(String studentId) {
        log.info("Fetching enrolled subjects for student: {}", studentId);
        return findProfile(studentId)
                .map(List::of)
                .orElseGet(List::of);
    }
    
    public UserProfile updateUserPreferences(String userId, 
                                             UserProfile.UserPreferences preferences) {
        log.info("Updating preferences for user: {}", userId);
        UserProfile profile = findProfile(userId)
            .orElseThrow(() -> new IllegalArgumentException("User profile not found"));
        
        profile.setPreferences(preferences);
        profile.setUpdatedAt(LocalDateTime.now());
        
        return userProfileRepository.save(profile);
    }
    
    public UserProfile enrollSubject(String studentId, String subjectId) {
        log.info("Enrolling student {} in subject {}", studentId, subjectId);
        UserProfile profile = findProfile(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        
        if (!profile.isStudent()) {
            throw new IllegalArgumentException("User is not a student");
        }

        long sid;
        try {
            sid = Long.parseLong(subjectId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid subject id");
        }

        subjectRepository.findByIdAndInstitution(sid, profile.getInstitution())
            .orElseThrow(() -> new IllegalArgumentException("Subject not found for student's institution"));
        
        if (!profile.getEnrolledSubjects().contains(subjectId)) {
            profile.getEnrolledSubjects().add(subjectId);
            profile.setUpdatedAt(LocalDateTime.now());
        }
        
        return userProfileRepository.save(profile);
    }
    
    public UserProfile updateScore(String studentId, Integer scoreIncrement) {
        log.info("Updating score for student {} by {}", studentId, scoreIncrement);
        UserProfile profile = findProfile(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        
        if (!profile.isStudent()) {
            throw new IllegalArgumentException("User is not a student");
        }
        
        profile.setTotalScore(profile.getTotalScore() + scoreIncrement);
        profile.setUpdatedAt(LocalDateTime.now());
        
        return userProfileRepository.save(profile);
    }
    
    public UserProfile createUser(UserProfile userProfile) {
        log.info("Creating new user: {}", userProfile.getEmail());
        userProfile.setCreatedAt(LocalDateTime.now());
        userProfile.setUpdatedAt(LocalDateTime.now());
        return userProfileRepository.save(userProfile);
    }
    
    public List<UserProfile> getAllUsersByInstitution(String institution) {
        log.info("Fetching users for institution: {}", institution);
        return userProfileRepository.findByInstitution(institution);
    }
    
    public UserProfile getUserById(String userId) {
        log.info("Fetching user by ID: {}", userId);
        return findProfile(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserProfile getUserByIdInInstitution(String userId, String institution) {
        log.info("Fetching user {} in institution {}", userId, institution);
        return findProfileInInstitution(userId, institution)
            .orElseThrow(() -> new IllegalArgumentException("User not found in institution"));
    }
    
    public UserProfile updateUser(String userId, UserProfile updatedProfile) {
        log.info("Updating user: {}", userId);
        UserProfile existing = findProfile(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Update fields
        existing.setFirstName(updatedProfile.getFirstName());
        existing.setLastName(updatedProfile.getLastName());
        existing.setInstitution(updatedProfile.getInstitution());
        existing.setRole(updatedProfile.getRole());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return userProfileRepository.save(existing);
    }

    public UserProfile updateUserInInstitution(String userId, String institution, UserProfile updatedProfile) {
        log.info("Updating user {} in institution {}", userId, institution);
        UserProfile existing = findProfileInInstitution(userId, institution)
            .orElseThrow(() -> new IllegalArgumentException("User not found in institution"));

        existing.setFirstName(updatedProfile.getFirstName());
        existing.setLastName(updatedProfile.getLastName());
        if (updatedProfile.getRole() != null) {
            existing.setRole(updatedProfile.getRole());
        }
        existing.setInstitution(institution);
        existing.setUpdatedAt(LocalDateTime.now());

        return userProfileRepository.save(existing);
    }
    
    public void deleteUser(String userId) {
        log.info("Deleting user: {}", userId);
        UserProfile existing = findProfile(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userProfileRepository.deleteById(existing.getId());
    }

    public void deleteUserInInstitution(String userId, String institution) {
        log.info("Deleting user {} in institution {}", userId, institution);
        UserProfile existing = findProfileInInstitution(userId, institution)
            .orElseThrow(() -> new IllegalArgumentException("User not found in institution"));
        userProfileRepository.deleteById(existing.getId());
    }

    private Optional<UserProfile> findProfileInInstitution(String userIdOrEmail, String institution) {
        if (userIdOrEmail == null || userIdOrEmail.isBlank() || institution == null || institution.isBlank()) {
            return Optional.empty();
        }
        try {
            return userProfileRepository.findByIdAndInstitution(Long.parseLong(userIdOrEmail.trim()), institution);
        } catch (NumberFormatException e) {
            return userProfileRepository.findByEmailAndInstitution(userIdOrEmail.trim(), institution);
        }
    }
}
