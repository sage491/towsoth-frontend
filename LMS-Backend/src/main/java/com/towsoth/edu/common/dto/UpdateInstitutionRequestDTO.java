package com.towsoth.edu.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
public class UpdateInstitutionRequestDTO {
    private String name;
    private String type;
    private String country;
    private String timezone;
    private String academicSession;
    private InstitutionBrandingDTO branding;
    private List<String> featuresEnabled;
    private Boolean autoStructureEnabled;
    private String adminEmail;
}
