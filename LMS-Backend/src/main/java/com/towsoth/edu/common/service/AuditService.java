package com.towsoth.edu.common.service;

import com.towsoth.edu.common.entity.AuditLog;
import com.towsoth.edu.common.entity.AuditLogRepository;
import com.towsoth.edu.common.utils.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String action, String resourceType, Long resourceId, Map<String, Object> metadata) {
        logAction(action, resourceType, resourceId, "SUCCESS", metadata);
    }

    public void logAction(String action, String resourceType, Long resourceId, String status, Map<String, Object> metadata) {
        try {
            Long institutionId = TenantContext.getTenantId();
            Long userId = TenantContext.getUserId();
            String userEmail = TenantContext.getUserEmail();

            if (institutionId == null) {
                log.warn("Audit log attempted without tenant context for action: {}", action);
                return;
            }

            AuditLog auditLog = AuditLog.builder()
                    .institutionId(institutionId)
                    .userId(userId)
                    .userEmail(userEmail)
                    .timestamp(LocalDateTime.now())
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .status(status)
                    .metadata(metadata != null ? metadata : new HashMap<>())
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Audit log created: action={}, resource={}, institution={}", action, resourceType, institutionId);
        } catch (Exception e) {
            log.error("Error logging audit action", e);
        }
    }
}
