package com.towsoth.edu.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InstitutionResponseDTO {
    private Long id;
    private String name;
    private String type;  // school, college, university
    private String country;
    private String timezone;
    private String academicSession;
    private InstitutionBrandingDTO branding;
    private String plan;
    private List<String> featuresEnabled;
    private Integer activeUsers;
    private Double storageUsage;
    private String status;  // active, suspended, archived
    private LocalDateTime createdDate;
    private LocalDateTime lastModified;
    private String modifiedBy;
    private String adminEmail;
    private Boolean autoStructureEnabled;
}
