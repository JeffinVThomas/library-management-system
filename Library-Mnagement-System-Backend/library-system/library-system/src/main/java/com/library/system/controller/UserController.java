package com.library.system.controller;

import com.library.system.dto.JwtAuthResponse;
import com.library.system.model.User;
import com.library.system.service.SmsService;
import com.library.system.service.UserService;
import com.library.system.util.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controller for handling user-related operations like registration, login, password reset,
 * OTP verification, and JWT-secured endpoints.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final SmsService smsService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, SmsService smsService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.smsService = smsService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registers a new user account.
     *
     * @param user the user details
     * @return the registered user
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User registeredUser = userService.register(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param loginRequest the user login request
     * @return JWT and user details if successful, else error
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        JwtAuthResponse response = new JwtAuthResponse(token, user.getEmail(), user.getRole(), user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Authenticates an admin user with role validation.
     *
     * @param loginRequest the admin login request
     * @return JWT and admin details if successful
     */
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody User loginRequest) {
        User user = userService.loginWithRole(loginRequest.getEmail(), loginRequest.getPassword(), "admin");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        JwtAuthResponse response = new JwtAuthResponse(token, user.getEmail(), user.getRole(), user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Sends OTP to the user's mobile number.
     *
     * @param mobile the user's mobile number
     * @return success or error message
     */
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String mobile) {
        try {
            userService.sendOtp(mobile);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Verifies the OTP entered by the user.
     *
     * @param mobile the user's mobile number
     * @param otp    the OTP entered
     * @return true if valid, false otherwise
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(@RequestParam String mobile, @RequestParam String otp) {
        boolean isValid = userService.verifyOtp(mobile, otp);
        return ResponseEntity.ok(isValid);
    }

    /**
     * Resets the user's password after OTP verification.
     *
     * @param mobile      the user's mobile number
     * @param newPassword the new password to set
     * @return success or error message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String mobile, @RequestParam String newPassword) {
        Optional<User> userOpt = userService.findByMobile(mobile);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            userService.updatePassword(user.getEmail(), newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mobile number not found");
        }
    }

    /**
     * Retrieves user details by mobile number.
     *
     * @param mobile the user's mobile number
     * @return user details or 404
     */
    @GetMapping("/by-mobile")
    public ResponseEntity<User> getUserByMobile(@RequestParam String mobile) {
        Optional<User> userOpt = userService.findByMobile(mobile);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Validates the provided JWT token.
     *
     * @param authHeader the Authorization header with Bearer token
     * @return success if valid, else error
     */
    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = jwtUtil.validateToken(token);
            if (isValid) {
                return ResponseEntity.ok("Token is valid");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    /**
     * Retrieves the user's profile using a valid JWT token.
     *
     * @param authHeader the Authorization header
     * @return user profile or error
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = jwtUtil.validateToken(token);
            if (isValid) {
                String email = jwtUtil.getEmailFromToken(token);
                Optional<User> userOpt = userService.findByEmail(email);
                if (userOpt.isPresent()) {
                    return ResponseEntity.ok(userOpt.get());
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    /**
     * Checks if an admin user already exists in the system.
     *
     * @return true if exists, false otherwise
     */
    @GetMapping("/admin-exists")
    public ResponseEntity<Boolean> checkAdminExists() {
        boolean exists = userService.existsByRole("admin");
        return ResponseEntity.ok(exists);
    }
}
