package com.library.system.service;

import com.library.system.model.User;
import com.library.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

/**
 * Service implementation for handling user operations like login,
 * registration, OTP generation/verification, and password reset.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final SmsService smsService;

    public UserServiceImpl(UserRepository userRepository, SmsService smsService, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.smsService = smsService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Logs in the user with email and password.
     */
    @Override
    public User login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    /**
     * Logs in user with role-based validation.
     */
    @Override
    public User loginWithRole(String email, String password, String role) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())
                    && user.getRole().equalsIgnoreCase(role)) {
                return user;
            }
        }
        return null;
    }

    /**
     * Finds user by email.
     */
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Finds user by mobile number.
     */
    @Override
    public Optional<User> findByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }

    /**
     * Checks if email already exists.
     */
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Checks if mobile number already exists.
     */
    @Override
    public boolean existsByMobile(String mobile) {
        return userRepository.existsByMobile(mobile);
    }

    /**
     * Updates user password after encoding it.
     */
    @Override
    public void updatePassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }
    }

    /**
     * Saves generated OTP and timestamp for a user.
     */
    @Override
    public void saveOtp(String mobile, String otp) {
        Optional<User> userOpt = userRepository.findByMobile(mobile);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setOtp(otp);
            user.setOtpGeneratedTime(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    /**
     * Verifies the OTP within 2 minutes.
     */
    @Override
    public boolean verifyOtp(String mobile, String otp) {
        Optional<User> userOpt = userRepository.findByMobile(mobile);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtp() != null && user.getOtpGeneratedTime() != null) {
                LocalDateTime expiryTime = user.getOtpGeneratedTime().plusMinutes(2);
                if (LocalDateTime.now().isBefore(expiryTime)) {
                    boolean isMatch = user.getOtp().equals(otp);
                    if (isMatch) {
                        user.setOtp(null);
                        user.setOtpGeneratedTime(null);
                        userRepository.save(user);
                    }
                    return isMatch;
                }
            }
        }
        return false;
    }

    /**
     * Sends a 6-digit OTP to the user using SMS.
     */
    @Override
    public void sendOtp(String mobile) {
        Optional<User> userOpt = userRepository.findByMobile(mobile);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Mobile number not registered");
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        saveOtp(mobile, otp);
        smsService.sendOtp(mobile, otp);
    }

    /**
     * Registers a new user after encoding their password.
     */
    @Override
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Checks if any user exists with the specified role.
     */
    @Override
    public boolean existsByRole(String role) {
        return userRepository.existsByRole(role);
    }
}
