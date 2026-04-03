package com.towsoth.edu.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${security.jwt.refresh-expiration}")
    private long jwtRefreshExpirationMs;

    public String generateToken(Long userId, Long institutionId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("institutionId", institutionId);
        claims.put("email", email);
        claims.put("role", role);
        
        return createToken(claims, userId.toString(), jwtExpirationMs);
    }

    public String generateRefreshToken(Long userId, Long institutionId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("institutionId", institutionId);
        claims.put("type", "REFRESH");
        
        return createToken(claims, userId.toString(), jwtRefreshExpirationMs);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey())
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return Long.parseLong(claims.getSubject());
    }

    public Long getInstitutionIdFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return ((Number) claims.get("institutionId")).longValue();
    }

    public String getEmailFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return (String) claims.get("email");
    }

    public String getRoleFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return (String) claims.get("role");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (SignatureException ex) {
            log.error("JWT signature validation failed: {}", ex.getMessage());
        }
        return false;
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Ensures a key length suitable for HMAC-SHA256 (JJWT picks the algorithm from key size).
     */
    private SecretKey signingKey() {
        byte[] raw = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (raw.length == 0) {
            raw = "dev-insecure-placeholder-replace-in-config".getBytes(StandardCharsets.UTF_8);
        }
        if (raw.length >= 32) {
            return Keys.hmacShaKeyFor(raw);
        }
        byte[] padded = Arrays.copyOf(raw, 32);
        for (int i = raw.length; i < 32; i++) {
            padded[i] = raw[i % Math.max(1, raw.length)];
        }
        return Keys.hmacShaKeyFor(padded);
    }
}
