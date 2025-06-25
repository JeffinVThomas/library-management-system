package com.library.system.service;

import com.library.system.model.User;
import com.library.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User register(User user) {
        return userRepository.save(user);
    }

    @Override
    public User loginWithRole(String email, String password, String role) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (
                user.getPassword().equals(password) &&
                user.getRole().equalsIgnoreCase(role)
            ) {
                return user;
            }
        }
        return null;
        
        
    }
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }


    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByMobile(String mobile) {
        return userRepository.existsByMobile(mobile);
    }

    @Override
    public void updatePassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(user -> {
            user.setPassword(newPassword);
            userRepository.save(user);
        });
    }
    
    @Override
    public void saveOtp(String mobile, String otp) {
        Optional<User> userOpt = userRepository.findByMobile(mobile);
        userOpt.ifPresent(user -> {
            user.setOtp(otp);
            user.setOtpGeneratedTime(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    @Override
    public boolean verifyOtp(String mobile, String otp) {
        Optional<User> userOpt = userRepository.findByMobile(mobile);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();

        // Check if OTP exists and is valid within 1 minute
        if (user.getOtp() != null && user.getOtpGeneratedTime() != null) {
            LocalDateTime expiryTime = user.getOtpGeneratedTime().plusMinutes(1);
            if (LocalDateTime.now().isAfter(expiryTime)) {
                return false; // OTP expired
            }
            return user.getOtp().equals(otp);
        }
        return false;
    }


}

