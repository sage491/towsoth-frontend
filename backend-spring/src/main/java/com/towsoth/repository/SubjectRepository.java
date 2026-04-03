package com.towsoth.repository;

import com.towsoth.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);
    List<Subject> findByInstitution(String institution);
    Optional<Subject> findByIdAndInstitution(Long id, String institution);
    List<Subject> findByIdIn(List<Long> ids);
    long countByInstitution(String institution);
}
