package com.towsoth.edu.modules.auth.service;

import com.towsoth.edu.modules.auth.dto.LoginRequestDTO;
import com.towsoth.edu.modules.auth.dto.LoginResponseDTO;
import com.towsoth.edu.modules.auth.entity.Role;
import com.towsoth.edu.modules.auth.repository.RoleRepository;
import com.towsoth.edu.modules.user.entity.User;
import com.towsoth.edu.modules.user.repository.UserRepository;
import com.towsoth.edu.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO request) {
        // Find user by email (without institution scope for login - can be cross-tenant)
        User user = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(request.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is active
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new RuntimeException("User account is not active");
        }

        // Get role name
        String roleName = user.getRole() != null ? user.getRole().getRoleKey() : "STUDENT";

        // Generate tokens
        String accessToken = tokenProvider.generateToken(
                user.getId(),
                user.getInstitutionId(),
                user.getEmail(),
                roleName
        );

        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getInstitutionId());

        return LoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .institutionId(user.getInstitutionId())
                .email(user.getEmail())
                .role(roleName)
                .build();
    }

    public LoginResponseDTO refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        Long userId = tokenProvider.getUserIdFromToken(refreshToken);
        Long institutionId = tokenProvider.getInstitutionIdFromToken(refreshToken);

        User user = userRepository.findByInstitutionIdAndId(institutionId, userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleName = user.getRole() != null ? user.getRole().getRoleKey() : "STUDENT";

        String newAccessToken = tokenProvider.generateToken(
                user.getId(),
                user.getInstitutionId(),
                user.getEmail(),
                roleName
        );

        return LoginResponseDTO.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .institutionId(user.getInstitutionId())
                .email(user.getEmail())
                .role(roleName)
                .build();
    }
}
