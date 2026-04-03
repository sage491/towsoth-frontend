package com.towsoth.repository;

import com.towsoth.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findBySubject(String subject);
    List<Test> findBySubjectAndInstitution(String subject, String institution);
    List<Test> findByDifficulty(String difficulty);
    List<Test> findByInstitution(String institution);
    Optional<Test> findByIdAndInstitution(Long id, String institution);
    long countByInstitution(String institution);
}

