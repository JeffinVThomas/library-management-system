package com.library.system.service;
import java.util.Optional;

import com.library.system.model.User;

public interface UserService {
    User register(User user);
    User loginWithRole(String email, String password, String role);
    
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);

    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);

    void updatePassword(String email, String newPassword);
    public void saveOtp(String mobile, String otp);
    boolean verifyOtp(String mobile, String otp);



}

