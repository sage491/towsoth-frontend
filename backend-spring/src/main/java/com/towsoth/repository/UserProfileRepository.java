package com.towsoth.repository;

import com.towsoth.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);
    Optional<UserProfile> findByEmailAndInstitution(String email, String institution);
    Optional<UserProfile> findByIdAndInstitution(Long id, String institution);
    List<UserProfile> findByInstitution(String institution);
    long countByInstitution(String institution);
}
