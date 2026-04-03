package com.towsoth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {
    
    @Value("${server.port}")
    public int port;
    
    @Value("${spring.data.mongodb.uri}")
    public String dbUri;
    
    @Value("${spring.data.mongodb.database}")
    public String dbName;
    
    @Value("${ai.server.url}")
    public String aiServerUrl;
    
    @Value("${ai.api.key}")
    public String aiApiKey;
    
    @Value("${jwt.secret}")
    public String jwtSecret;
    
    @Value("${jwt.expiration}")
    public long jwtExpiration;
    
    @Value("${cors.allowed-origins}")
    public String corsAllowedOrigins;
}

