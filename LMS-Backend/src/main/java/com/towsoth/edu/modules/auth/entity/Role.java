package com.towsoth.edu.modules.auth.entity;

import com.towsoth.edu.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "roles", indexes = {
        @Index(name = "idx_role_name", columnList = "name", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Role extends BaseEntity {
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "role_key", nullable = false, unique = true, length = 100)
    private String roleKey;  // SUPER_ADMIN, INSTITUTION_ADMIN, FACULTY, STUDENT

    @Column(name = "rank", nullable = false)
    @Builder.Default
    private Integer rank = 100;  // Lower number = higher privilege
}
