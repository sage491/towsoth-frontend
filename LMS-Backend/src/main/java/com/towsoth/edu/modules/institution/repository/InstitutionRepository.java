package com.towsoth.edu.modules.institution.repository;

import com.towsoth.edu.modules.institution.entity.Institution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    
    Page<Institution> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    
    Page<Institution> findByPlanOrderByCreatedAtDesc(String plan, Pageable pageable);
    
    @Query("SELECT i FROM Institution i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) ORDER BY i.createdAt DESC")
    Page<Institution> searchByName(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT i FROM Institution i WHERE i.status = :status AND LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) ORDER BY i.createdAt DESC")
    Page<Institution> searchByNameAndStatus(@Param("search") String search, @Param("status") String status, Pageable pageable);
    
    Optional<Institution> findByName(String name);
    
    long countByStatus(String status);
    
    long countByPlan(String plan);
    
    List<Institution> findByStatusIn(List<String> statuses);
}
