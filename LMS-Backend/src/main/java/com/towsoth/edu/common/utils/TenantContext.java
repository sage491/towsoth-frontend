package com.towsoth.edu.common.utils;

import lombok.Data;

@Data
public class TenantContext {
    private static final ThreadLocal<Long> tenantId = new ThreadLocal<>();
    private static final ThreadLocal<Long> userId = new ThreadLocal<>();
    private static final ThreadLocal<String> userEmail = new ThreadLocal<>();
    private static final ThreadLocal<String> userRole = new ThreadLocal<>();

    public static void setTenantId(Long id) {
        tenantId.set(id);
    }

    public static Long getTenantId() {
        return tenantId.get();
    }

    public static void setUserId(Long id) {
        userId.set(id);
    }

    public static Long getUserId() {
        return userId.get();
    }

    public static void setUserEmail(String email) {
        userEmail.set(email);
    }

    public static String getUserEmail() {
        return userEmail.get();
    }

    public static void setUserRole(String role) {
        userRole.set(role);
    }

    public static String getUserRole() {
        return userRole.get();
    }

    public static void clear() {
        tenantId.remove();
        userId.remove();
        userEmail.remove();
        userRole.remove();
    }
}
