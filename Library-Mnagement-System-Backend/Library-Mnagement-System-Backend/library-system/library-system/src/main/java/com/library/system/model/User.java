package com.library.system.model;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String role = "user"; // default role
    @Column(length = 10, unique = true)
    private String mobile;
    
    @Transient // Optional: if you don't want to persist the OTP in DB
    private String otp;

    @Transient // Optional: if you don't want to persist timestamp
    private LocalDateTime otpGeneratedTime;


   
}
