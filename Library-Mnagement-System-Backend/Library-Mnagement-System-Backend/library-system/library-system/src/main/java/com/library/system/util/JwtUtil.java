package com.library.system.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // Replace with a strong key in real applications and keep it secret (e.g., from application.properties)
    private final String SECRET_KEY = "secret123"; 

    // Token validity: 24 hours
    private final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    // ✅ Generate a JWT token with email and role
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // ✅ Extract email from token (subject)
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ Extract role from token
    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }

    // ✅ Validate token expiration and structure
    public boolean isTokenValid(String token) {
        try {
            getClaims(token); // throws exception if invalid or expired
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ Internal method to parse token and get all claims
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
