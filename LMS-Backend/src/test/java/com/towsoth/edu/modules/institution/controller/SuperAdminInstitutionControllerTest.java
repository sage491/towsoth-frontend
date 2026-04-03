package com.towsoth.edu.modules.institution.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.towsoth.edu.common.dto.CreateInstitutionRequestDTO;
import com.towsoth.edu.common.dto.InstitutionResponseDTO;
import com.towsoth.edu.modules.institution.service.InstitutionService;
import com.towsoth.edu.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Institution Controller Tests")
class SuperAdminInstitutionControllerTest {

    /** Servlet path only — context path /api is applied by Spring Boot, not duplicated in MockMvc. */
    private static final String API = "/super-admin/institutions";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @MockBean
    private InstitutionService institutionService;

    private String validToken;

    @BeforeEach
    void setUp() {
        validToken = tokenProvider.generateToken(1L, 1L, "admin@example.com", "SUPER_ADMIN");
    }

    @Test
    @DisplayName("Should create institution successfully")
    void testCreateInstitution() throws Exception {
        CreateInstitutionRequestDTO request = CreateInstitutionRequestDTO.builder()
                .name("Test University")
                .type("university")
                .country("USA")
                .timezone("America/New_York")
                .academicSession("2025-2026")
                .planId("pro")
                .adminName("John Doe")
                .adminEmail("john@test.edu")
                .autoStructureEnabled(true)
                .build();

        InstitutionResponseDTO response = InstitutionResponseDTO.builder()
                .id(1L)
                .name("Test University")
                .type("university")
                .status("ACTIVE")
                .createdDate(LocalDateTime.now())
                .build();

        when(institutionService.createInstitution(any())).thenReturn(response);

        mockMvc.perform(post(API)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Test University"))
                .andExpect(jsonPath("$.message").value("Institution created successfully"));
    }

    @Test
    @DisplayName("Should validate required fields")
    void testCreateInstitutionMissingFields() throws Exception {
        CreateInstitutionRequestDTO request = CreateInstitutionRequestDTO.builder()
                .name("Test University")
                // Missing required fields
                .build();

        mockMvc.perform(post(API)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Should deny access without valid token")
    void testCreateInstitutionUnauthorized() throws Exception {
        CreateInstitutionRequestDTO request = CreateInstitutionRequestDTO.builder()
                .name("Test University")
                .type("university")
                .country("USA")
                .timezone("America/New_York")
                .academicSession("2025-2026")
                .planId("pro")
                .adminName("John Doe")
                .adminEmail("john@test.edu")
                .build();

        mockMvc.perform(post(API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(result -> assertTrue(
                        result.getResponse().getStatus() == 401
                                || result.getResponse().getStatus() == 403));
    }
}
