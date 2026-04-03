package com.towsoth.edu.modules.institution.repository;

import com.towsoth.edu.modules.institution.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {
    Optional<Feature> findByFeatureKey(String featureKey);
}
