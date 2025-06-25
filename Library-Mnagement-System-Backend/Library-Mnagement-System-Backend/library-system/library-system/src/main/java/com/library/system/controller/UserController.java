package com.library.system.controller;

import com.library.system.model.User;
import com.library.system.service.SmsService;
import com.library.system.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final SmsService smsService;
    private final Map<String, String> otpStorage = new HashMap<>();
    

    public UserController(UserService userService, SmsService smsService) {
        this.userService = userService;
        this.smsService = smsService;
    }
 

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        User user = userService.loginWithRole(loginRequest.getEmail(), loginRequest.getPassword(), loginRequest.getRole());
        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    // ✅ New admin login endpoint
    @PostMapping("/admin/login")
    public User loginAdmin(@RequestBody User loginRequest) {
        User user = userService.loginWithRole(loginRequest.getEmail(), loginRequest.getPassword(), "admin");
        if (user == null) {
            throw new RuntimeException("Invalid admin credentials");
        }
        return user;
    }
    
    // ✅ Send OTP via Twilio SMS
    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String mobile) {
        Optional<User> userOpt = userService.findByMobile(mobile);
        System.out.println("User found? " + userOpt.isPresent());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Mobile number not registered");
        }

        // Generate 6-digit OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpStorage.put(mobile, otp);

        // Send OTP using Twilio
        smsService.sendOtp(mobile, otp);

        return "OTP sent successfully";
    }
    
    // ✅ Verify OTP
    @PostMapping("/verify-otp")
    public boolean verifyOtp(@RequestParam String mobile, @RequestParam String otp) {
        return otp.equals(otpStorage.get(mobile));
    }

    // ✅ Reset password after OTP verification
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String mobile, @RequestParam String newPassword) {
        Optional<User> userOpt = userService.findByMobile(mobile);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Mobile number not found");
        }

        User user = userOpt.get();
        user.setPassword(newPassword);
        userService.register(user); // Save updated user

        otpStorage.remove(mobile); // Clear OTP after successful reset
        return "Password reset successfully";
    }
    
    @GetMapping("/by-mobile")
    public ResponseEntity<User> getUserByMobile(@RequestParam String mobile) {
        return userService.findByMobile(mobile)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

}


