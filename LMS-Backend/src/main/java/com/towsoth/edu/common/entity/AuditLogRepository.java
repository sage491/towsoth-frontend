package com.towsoth.edu.common.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    // Institution-scoped audit queries
    Page<AuditLog> findByInstitutionIdOrderByTimestampDesc(Long institutionId, Pageable pageable);
    
    Page<AuditLog> findByInstitutionIdAndActionOrderByTimestampDesc(Long institutionId, String action, Pageable pageable);
    
    Page<AuditLog> findByInstitutionIdAndStatusOrderByTimestampDesc(Long institutionId, String status, Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE a.institutionId = :institutionId AND a.timestamp BETWEEN :startTime AND :endTime ORDER BY a.timestamp DESC")
    Page<AuditLog> findByInstitutionIdAndTimestampRange(@Param("institutionId") Long institutionId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE a.institutionId = :institutionId AND a.userId = :userId ORDER BY a.timestamp DESC")
    Page<AuditLog> findByInstitutionIdAndUserId(@Param("institutionId") Long institutionId, @Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE a.institutionId = :institutionId AND a.resourceType = :resourceType AND a.resourceId = :resourceId ORDER BY a.timestamp DESC")
    List<AuditLog> findAuditTrailForResource(@Param("institutionId") Long institutionId, @Param("resourceType") String resourceType, @Param("resourceId") Long resourceId);
    
    long countByInstitutionId(Long institutionId);
}
