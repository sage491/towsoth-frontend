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
public class AuditLogResponseDTO {
    private Long id;
    private LocalDateTime timestamp;
    private String user;
    private String action;
    private String resource;
    private String details;
    private String ipAddress;
    private String status;  // success, warning, error
}
