package com.towsoth.edu.modules.institution.entity;

import com.towsoth.edu.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "institutions", indexes = {
        @Index(name = "idx_institution_status", columnList = "status"),
        @Index(name = "idx_institution_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Institution extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "type", nullable = false, length = 50)
    private String type;  // school, college, university

    @Column(name = "country", nullable = false, length = 100)
    private String country;

    @Column(name = "timezone", length = 50)
    private String timezone;

    @Column(name = "academic_session", length = 255)
    private String academicSession;

    @Column(name = "plan", length = 50)
    private String plan;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "institution_features", joinColumns = @JoinColumn(name = "institution_id"))
    @Column(name = "feature_id")
    private List<String> featuresEnabled;

    @Column(name = "active_users")
    private Integer activeUsers;

    @Column(name = "storage_usage")
    private Double storageUsage;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";  // ACTIVE, SUSPENDED, ARCHIVED

    @Column(name = "admin_email", length = 255)
    private String adminEmail;

    @Column(name = "auto_structure_enabled")
    @Builder.Default
    private Boolean autoStructureEnabled = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "branding", columnDefinition = "jsonb")
    private Map<String, Object> branding = new HashMap<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb")
    private Map<String, Object> metadata = new HashMap<>();
}
