package com.towsoth.edu.modules.auth.entity;

import com.towsoth.edu.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "permissions", indexes = {
        @Index(name = "idx_permission_key", columnList = "permission_key", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Permission extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "permission_key", nullable = false, unique = true, length = 100)
    private String permissionKey;  // e.g., INSTITUTION_CREATE, INSTITUTION_READ, etc.

    @Column(name = "category", length = 100)
    private String category;  // e.g., INSTITUTION, USER, AUDIT, etc.

    @Column(name = "resource_type", length = 100)
    private String resourceType;
}
