package com.towsoth.edu.modules.institution.controller;

import com.towsoth.edu.common.dto.CreateInstitutionRequestDTO;
import com.towsoth.edu.common.dto.InstitutionResponseDTO;
import com.towsoth.edu.common.dto.UpdateInstitutionRequestDTO;
import com.towsoth.edu.common.response.ApiResponse;
import com.towsoth.edu.modules.institution.service.InstitutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/institutions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class InstitutionController {

    private final InstitutionService institutionService;

    @GetMapping
    public ApiResponse<Page<InstitutionResponseDTO>> getInstitutions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "all") String plan,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit) {
        
        Pageable pageable = PageRequest.of(page, limit);
        Page<InstitutionResponseDTO> institutions = institutionService.getAllInstitutions(search, plan, status, pageable);
        return ApiResponse.success(institutions);
    }

    @GetMapping("/{id}")
    public ApiResponse<InstitutionResponseDTO> getInstitution(@PathVariable Long id) {
        InstitutionResponseDTO institution = institutionService.getInstitutionById(id);
        return ApiResponse.success(institution);
    }

    @PostMapping
    public ApiResponse<InstitutionResponseDTO> createInstitution(@Valid @RequestBody CreateInstitutionRequestDTO request) {
        InstitutionResponseDTO institution = institutionService.createInstitution(request);
        return ApiResponse.success(institution, "Institution created successfully");
    }

    @PatchMapping("/{id}")
    public ApiResponse<InstitutionResponseDTO> updateInstitution(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInstitutionRequestDTO request) {
        InstitutionResponseDTO institution = institutionService.updateInstitution(id, request);
        return ApiResponse.success(institution, "Institution updated successfully");
    }

    @PostMapping("/{id}/suspend")
    public ApiResponse<InstitutionResponseDTO> suspendInstitution(@PathVariable Long id) {
        InstitutionResponseDTO institution = institutionService.suspendInstitution(id);
        return ApiResponse.success(institution, "Institution suspended successfully");
    }

    @PostMapping("/{id}/resume")
    public ApiResponse<InstitutionResponseDTO> resumeInstitution(@PathVariable Long id) {
        InstitutionResponseDTO institution = institutionService.resumeInstitution(id);
        return ApiResponse.success(institution, "Institution resumed successfully");
    }

    @PostMapping("/{id}/archive")
    public ApiResponse<InstitutionResponseDTO> archiveInstitution(@PathVariable Long id) {
        InstitutionResponseDTO institution = institutionService.archiveInstitution(id);
        return ApiResponse.success(institution, "Institution archived successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteInstitution(@PathVariable Long id) {
        institutionService.deleteInstitution(id);
        return ApiResponse.success(null, "Institution deleted successfully");
    }
}
