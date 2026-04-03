package com.towsoth.edu.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String institution;
    private Long institutionId;
    private String role;
    private String status;  // active, inactive, suspended
    private LocalDateTime lastLogin;
    private String activityLevel;  // high, medium, low
    private LocalDateTime createdDate;
}
