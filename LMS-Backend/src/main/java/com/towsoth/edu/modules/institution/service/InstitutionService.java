package com.towsoth.edu.modules.institution.service;

import com.towsoth.edu.common.dto.CreateInstitutionRequestDTO;
import com.towsoth.edu.common.dto.InstitutionResponseDTO;
import com.towsoth.edu.common.dto.UpdateInstitutionRequestDTO;
import com.towsoth.edu.common.service.AuditService;
import com.towsoth.edu.common.utils.TenantContext;
import com.towsoth.edu.modules.institution.entity.Institution;
import com.towsoth.edu.modules.institution.mapper.InstitutionMapper;
import com.towsoth.edu.modules.institution.repository.InstitutionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class InstitutionService {

    private final InstitutionRepository institutionRepository;
    private final InstitutionMapper institutionMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public Page<InstitutionResponseDTO> getAllInstitutions(String search, String plan, String status, Pageable pageable) {
        Page<Institution> institutions;

        if (search != null && !search.isEmpty()) {
            if (plan != null && !plan.equals("all") && status != null && !status.equals("all")) {
                institutions = institutionRepository.searchByNameAndStatus(search, status, pageable);
            } else if (plan != null && !plan.equals("all")) {
                institutions = institutionRepository.searchByName(search, pageable);
            } else if (status != null && !status.equals("all")) {
                institutions = institutionRepository.searchByNameAndStatus(search, status, pageable);
            } else {
                institutions = institutionRepository.searchByName(search, pageable);
            }
        } else if (plan != null && !plan.equals("all")) {
            institutions = institutionRepository.findByPlanOrderByCreatedAtDesc(plan, pageable);
        } else if (status != null && !status.equals("all")) {
            institutions = institutionRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            institutions = institutionRepository.findAll(pageable);
        }

        return institutions.map(institutionMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public InstitutionResponseDTO getInstitutionById(Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institution not found with id: " + id));
        return institutionMapper.toDTO(institution);
    }

    public InstitutionResponseDTO createInstitution(CreateInstitutionRequestDTO request) {
        // Check if institution already exists
        if (institutionRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Institution with name '" + request.getName() + "' already exists");
        }

        Institution institution = Institution.builder()
                .name(request.getName())
                .type(request.getType())
                .country(request.getCountry())
                .timezone(request.getTimezone())
                .academicSession(request.getAcademicSession())
                .plan(request.getPlanId())
                .featuresEnabled(request.getFeaturesEnabled())
                .activeUsers(0)
                .storageUsage(0.0)
                .status("ACTIVE")
                .adminEmail(request.getAdminEmail())
                .autoStructureEnabled(request.getAutoStructureEnabled() != null ? request.getAutoStructureEnabled() : false)
                .createdBy(TenantContext.getUserEmail())
                .updatedBy(TenantContext.getUserEmail())
                .build();

        if (request.getBranding() != null) {
            Map<String, Object> branding = new HashMap<>();
            branding.put("displayName", request.getBranding().getDisplayName());
            branding.put("primaryColor", request.getBranding().getPrimaryColor());
            branding.put("secondaryColor", request.getBranding().getSecondaryColor());
            branding.put("logoUrl", request.getBranding().getLogoUrl());
            institution.setBranding(branding);
        }

        Institution saved = institutionRepository.save(institution);

        // Audit log
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("adminEmail", request.getAdminEmail());
        metadata.put("plan", request.getPlanId());
        TenantContext.setTenantId(saved.getId());  // Temporarily set context for audit
        auditService.logAction("INSTITUTION_CREATED", "INSTITUTION", saved.getId(), metadata);
        TenantContext.clear();

        return institutionMapper.toDTO(saved);
    }

    public InstitutionResponseDTO updateInstitution(Long id, UpdateInstitutionRequestDTO request) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institution not found with id: " + id));

        if (request.getName() != null && !request.getName().equals(institution.getName())) {
            if (institutionRepository.findByName(request.getName()).isPresent()) {
                throw new RuntimeException("Institution with name '" + request.getName() + "' already exists");
            }
            institution.setName(request.getName());
        }

        if (request.getType() != null) institution.setType(request.getType());
        if (request.getCountry() != null) institution.setCountry(request.getCountry());
        if (request.getTimezone() != null) institution.setTimezone(request.getTimezone());
        if (request.getAcademicSession() != null) institution.setAcademicSession(request.getAcademicSession());
        if (request.getFeaturesEnabled() != null) institution.setFeaturesEnabled(request.getFeaturesEnabled());
        if (request.getAdminEmail() != null) institution.setAdminEmail(request.getAdminEmail());
        if (request.getAutoStructureEnabled() != null) institution.setAutoStructureEnabled(request.getAutoStructureEnabled());
        if (request.getBranding() != null) {
            Map<String, Object> branding = new HashMap<>();
            branding.put("displayName", request.getBranding().getDisplayName());
            branding.put("primaryColor", request.getBranding().getPrimaryColor());
            branding.put("secondaryColor", request.getBranding().getSecondaryColor());
            branding.put("logoUrl", request.getBranding().getLogoUrl());
            institution.setBranding(branding);
        }

        institution.setUpdatedBy(TenantContext.getUserEmail());

        Institution updated = institutionRepository.save(institution);

        // Audit log
        TenantContext.setTenantId(id);
        auditService.logAction("INSTITUTION_UPDATED", "INSTITUTION", id, new HashMap<>());
        TenantContext.clear();

        return institutionMapper.toDTO(updated);
    }

    public InstitutionResponseDTO suspendInstitution(Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institution not found with id: " + id));

        if ("SUSPENDED".equals(institution.getStatus())) {
            return institutionMapper.toDTO(institution);  // Idempotent
        }

        institution.setStatus("SUSPENDED");
        institution.setUpdatedBy(TenantContext.getUserEmail());
        Institution updated = institutionRepository.save(institution);

        // Audit log
        TenantContext.setTenantId(id);
        auditService.logAction("INSTITUTION_SUSPENDED", "INSTITUTION", id, new HashMap<>());
        TenantContext.clear();

        return institutionMapper.toDTO(updated);
    }

    public InstitutionResponseDTO resumeInstitution(Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institution not found with id: " + id));

        if ("ACTIVE".equals(institution.getStatus())) {
            return institutionMapper.toDTO(institution);  // Idempotent
        }

        institution.setStatus("ACTIVE");
        institution.setUpdatedBy(TenantContext.getUserEmail());
        Institution updated = institutionRepository.save(institution);

        // Audit log
        TenantContext.setTenantId(id);
        auditService.logAction("INSTITUTION_RESUMED", "INSTITUTION", id, new HashMap<>());
        TenantContext.clear();

        return institutionMapper.toDTO(updated);
    }

    public InstitutionResponseDTO archiveInstitution(Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institution not found with id: " + id));

        if ("ARCHIVED".equals(institution.getStatus())) {
            return institutionMapper.toDTO(institution);  // Idempotent
        }

        institution.setStatus("ARCHIVED");
        institution.setUpdatedBy(TenantContext.getUserEmail());
        Institution updated = institutionRepository.save(institution);

        // Audit log
        TenantContext.setTenantId(id);
        auditService.logAction("INSTITUTION_ARCHIVED", "INSTITUTION", id, new HashMap<>());
        TenantContext.clear();

        return institutionMapper.toDTO(updated);
    }

    public void deleteInstitution(Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institution not found with id: " + id));

        institutionRepository.delete(institution);

        // Audit log
        TenantContext.setTenantId(id);
        auditService.logAction("INSTITUTION_DELETED", "INSTITUTION", id, new HashMap<>());
        TenantContext.clear();
    }
}
