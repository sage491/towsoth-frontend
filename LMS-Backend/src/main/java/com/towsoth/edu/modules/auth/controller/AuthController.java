package com.towsoth.edu.modules.auth.controller;

import com.towsoth.edu.common.response.ApiResponse;
import com.towsoth.edu.modules.auth.dto.LoginRequestDTO;
import com.towsoth.edu.modules.auth.dto.LoginResponseDTO;
import com.towsoth.edu.modules.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return ApiResponse.success(response, "Login successful");
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponseDTO> refresh(@RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        LoginResponseDTO response = authService.refreshToken(token);
        return ApiResponse.success(response, "Token refreshed");
    }
}
