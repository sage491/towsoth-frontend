package com.towsoth.edu.modules.user.entity;

import com.towsoth.edu.common.entity.BaseEntity;
import com.towsoth.edu.modules.auth.entity.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_institution_email", columnList = "institution_id,email", unique = true),
        @Index(name = "idx_user_status", columnList = "status"),
        @Index(name = "idx_user_institution_status", columnList = "institution_id,status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity {
    
    @Column(name = "institution_id", nullable = false)
    private Long institutionId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";  // ACTIVE, INACTIVE, SUSPENDED

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "activity_level", length = 50)
    @Builder.Default
    private String activityLevel = "MEDIUM";  // HIGH, MEDIUM, LOW

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "verified")
    @Builder.Default
    private Boolean verified = false;

    @Column(name = "last_password_change")
    private LocalDateTime lastPasswordChange;
}
