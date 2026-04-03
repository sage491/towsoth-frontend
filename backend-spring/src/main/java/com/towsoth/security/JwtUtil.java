package com.towsoth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Locale;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    
    @Value("${jwt.secret:your-secret-key-change-in-production}")
    private String jwtSecret;

    @Value("${jwt.expiration:604800000}")
    private long jwtExpirationMs;
    
    private static final String BEARER_PREFIX = "Bearer ";
    
    /**
     * Extract JWT token from Authorization header
     */
    public String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length());
        }
        return null;
    }
    
    public String extractUserId(String token) {
        try {
            Claims claims = parseClaims(token);
            String subject = claims.getSubject();
            if (subject != null && !subject.isBlank()) {
                return subject;
            }

            Object userIdClaim = claims.get("userId");
            if (userIdClaim != null) {
                String userId = String.valueOf(userIdClaim).trim();
                if (!userId.isEmpty()) {
                    return userId;
                }
            }

            throw new IllegalArgumentException("Token subject is missing");
        } catch (Exception e) {
            log.error("Error extracting user ID from token: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid token: " + e.getMessage());
        }
    }

    public String extractRole(String token) {
        try {
            Claims claims = parseClaims(token);
            Object roleClaim = claims.get("role");
            if (roleClaim == null) {
                return "STUDENT";
            }

            String role = String.valueOf(roleClaim).trim();
            if (role.isEmpty()) {
                return "STUDENT";
            }

            return role.toUpperCase(Locale.ROOT);
        } catch (Exception e) {
            log.error("Error extracting role from token: {}", e.getMessage());
            return "STUDENT";
        }
    }

    public String generateToken(String userId, String email, String role, String displayName) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .claim("role", role == null ? "STUDENT" : role.toUpperCase(Locale.ROOT))
                .claim("displayName", displayName)
                .issuedAt(new Date(now))
                .expiration(new Date(now + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token validation error: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage());
            return false;
        }
    }

    private Claims parseClaims(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token is empty");
        }

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

