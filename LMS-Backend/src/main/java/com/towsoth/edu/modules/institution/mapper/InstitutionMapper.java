package com.towsoth.edu.modules.institution.mapper;

import com.towsoth.edu.common.dto.InstitutionBrandingDTO;
import com.towsoth.edu.common.dto.InstitutionResponseDTO;
import com.towsoth.edu.modules.institution.entity.Institution;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class InstitutionMapper {

    public InstitutionResponseDTO toDTO(Institution entity) {
        if (entity == null) {
            return null;
        }

        InstitutionBrandingDTO branding = null;
        if (entity.getBranding() != null && !entity.getBranding().isEmpty()) {
            branding = InstitutionBrandingDTO.builder()
                    .displayName((String) entity.getBranding().get("displayName"))
                    .primaryColor((String) entity.getBranding().get("primaryColor"))
                    .secondaryColor((String) entity.getBranding().get("secondaryColor"))
                    .logoUrl((String) entity.getBranding().get("logoUrl"))
                    .build();
        }

        return InstitutionResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .country(entity.getCountry())
                .timezone(entity.getTimezone())
                .academicSession(entity.getAcademicSession())
                .branding(branding)
                .plan(entity.getPlan())
                .featuresEnabled(entity.getFeaturesEnabled())
                .activeUsers(entity.getActiveUsers())
                .storageUsage(entity.getStorageUsage())
                .status(entity.getStatus())
                .createdDate(entity.getCreatedAt())
                .lastModified(entity.getUpdatedAt())
                .modifiedBy(entity.getUpdatedBy())
                .adminEmail(entity.getAdminEmail())
                .autoStructureEnabled(entity.getAutoStructureEnabled())
                .build();
    }

    public Institution toEntity(InstitutionResponseDTO dto) {
        if (dto == null) {
            return null;
        }

        Map<String, Object> branding = null;
        if (dto.getBranding() != null) {
            branding = Map.ofEntries(
                    Map.entry("displayName", dto.getBranding().getDisplayName()),
                    Map.entry("primaryColor", dto.getBranding().getPrimaryColor()),
                    Map.entry("secondaryColor", dto.getBranding().getSecondaryColor()),
                    Map.entry("logoUrl", dto.getBranding().getLogoUrl())
            );
        }

        return Institution.builder()
                .id(dto.getId())
                .name(dto.getName())
                .type(dto.getType())
                .country(dto.getCountry())
                .timezone(dto.getTimezone())
                .academicSession(dto.getAcademicSession())
                .branding(branding)
                .plan(dto.getPlan())
                .featuresEnabled(dto.getFeaturesEnabled())
                .activeUsers(dto.getActiveUsers())
                .storageUsage(dto.getStorageUsage())
                .status(dto.getStatus())
                .adminEmail(dto.getAdminEmail())
                .autoStructureEnabled(dto.getAutoStructureEnabled())
                .build();
    }
}
