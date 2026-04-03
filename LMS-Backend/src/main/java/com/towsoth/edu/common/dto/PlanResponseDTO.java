package com.towsoth.edu.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlanResponseDTO {
    private Long id;
    private String name;
    private String tier;  // starter, pro, enterprise
    private Double price;
    private Long userLimit;
    private Long storageLimit;
    private String status;  // active, deprecated
}
