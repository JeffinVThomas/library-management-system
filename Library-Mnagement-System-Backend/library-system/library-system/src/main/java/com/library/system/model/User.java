package com.library.system.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a user in the Library Management System.
 * A user can be a normal user or an admin.
 * Supports OTP-based login and password reset.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /**
     * Auto-generated unique ID for each user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Full name of the user.
     */
    private String name;

    /**
     * Email address (must be unique).
     */
    @Column(unique = true)
    private String email;

    /**
     * Encrypted password of the user.
     */
    private String password;

    /**
     * Role of the user (e.g., "user" or "admin").
     * Default is "user".
     */
    private String role = "user";

    /**
     * Mobile number (10 digits, must be unique).
     */
    @Column(length = 10, unique = true)
    private String mobile;

    /**
     * One-Time Password for account verification or password reset.
     */
    private String otp;

    /**
     * Timestamp when the OTP was generated.
     */
    @Column(name = "otp_generated_time", columnDefinition = "DATETIME")
    private LocalDateTime otpGeneratedTime;
}
