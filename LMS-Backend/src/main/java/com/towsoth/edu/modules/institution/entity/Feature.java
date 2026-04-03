package com.towsoth.edu.modules.institution.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "features", indexes = {
        @Index(name = "idx_feature_key", columnList = "feature_key", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feature {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "feature_key", nullable = false, unique = true, length = 100)
    private String featureKey;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "enabled")
    @Builder.Default
    private Boolean enabled = true;
}
