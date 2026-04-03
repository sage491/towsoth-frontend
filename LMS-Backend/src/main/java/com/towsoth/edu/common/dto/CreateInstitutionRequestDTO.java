package com.towsoth.edu.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateInstitutionRequestDTO {
    @NotBlank(message = "Institution name is required")
    private String name;

    @NotBlank(message = "Institution type is required")
    private String type;  // school, college, university

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Timezone is required")
    private String timezone;

    @NotBlank(message = "Academic session is required")
    private String academicSession;

    private InstitutionBrandingDTO branding;

    @NotBlank(message = "Plan ID is required")
    private String planId;

    private List<String> featuresEnabled;

    private Boolean autoStructureEnabled;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    @NotBlank(message = "Admin email is required")
    @Email(message = "Admin email should be valid")
    private String adminEmail;
}
