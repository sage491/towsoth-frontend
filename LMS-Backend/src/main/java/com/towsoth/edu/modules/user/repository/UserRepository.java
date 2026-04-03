package com.towsoth.edu.modules.user.repository;

import com.towsoth.edu.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Institution-scoped queries (CRITICAL for multi-tenancy)
    Page<User> findByInstitutionIdAndStatusOrderByCreatedAtDesc(Long institutionId, String status, Pageable pageable);
    
    Page<User> findByInstitutionIdOrderByCreatedAtDesc(Long institutionId, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.institutionId = :institutionId AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY u.createdAt DESC")
    Page<User> searchByInstitutionAndNameOrEmail(@Param("institutionId") Long institutionId, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.institutionId = :institutionId AND u.status = :status AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY u.createdAt DESC")
    Page<User> searchByInstitutionStatusAndNameOrEmail(@Param("institutionId") Long institutionId, @Param("status") String status, @Param("search") String search, Pageable pageable);
    
    Optional<User> findByInstitutionIdAndEmail(Long institutionId, String email);
    
    Optional<User> findByInstitutionIdAndId(Long institutionId, Long userId);
    
    List<User> findByInstitutionIdAndStatus(Long institutionId, String status);
    
    long countByInstitutionIdAndStatus(Long institutionId, String status);
    
    long countByInstitutionId(Long institutionId);
}
