package com.library.system.service;

import java.util.Optional;
import com.library.system.model.User;

/**
 * Service interface for managing user-related operations
 * such as registration, login, OTP handling, and password updates.
 */
public interface UserService {

    /**
     * Registers a new user with encrypted password.
     *
     * @param user the user object to register
     * @return the registered user
     */
    User register(User user);

    /**
     * Logs in a user by verifying email and password.
     *
     * @param email user's email
     * @param password user's password
     * @return the logged-in user if credentials are correct; otherwise null
     */
    User login(String email, String password);

    /**
     * Logs in a user and verifies both password and role.
     *
     * @param email user's email
     * @param password user's password
     * @param role user's role (e.g., "admin" or "user")
     * @return the user if credentials and role match; otherwise null
     */
    User loginWithRole(String email, String password, String role);

    /**
     * Updates the password for a user with the specified email.
     *
     * @param email the user's email
     * @param newPassword the new password to set (should be encoded)
     */
    void updatePassword(String email, String newPassword);

    /**
     * Finds a user by email.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by mobile number.
     *
     * @param mobile the mobile number to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByMobile(String mobile);

    /**
     * Checks if a user exists with the given email.
     *
     * @param email the email to check
     * @return true if a user exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Checks if a user exists with the given mobile number.
     *
     * @param mobile the mobile number to check
     * @return true if a user exists, false otherwise
     */
    boolean existsByMobile(String mobile);

    /**
     * Checks if a user exists with the specified role.
     *
     * @param role the role to check (e.g., "admin")
     * @return true if a user exists with that role
     */
    boolean existsByRole(String role);

    /**
     * Saves an OTP and its generated time for the given mobile number.
     *
     * @param mobile the mobile number to associate with the OTP
     * @param otp the one-time password to save
     */
    void saveOtp(String mobile, String otp);

    /**
     * Verifies if the provided OTP is valid and not expired.
     *
     * @param mobile the mobile number associated with the OTP
     * @param otp the OTP to verify
     * @return true if valid, false if expired or incorrect
     */
    boolean verifyOtp(String mobile, String otp);

    /**
     * Sends a new OTP to the given mobile number using SMS.
     *
     * @param mobile the recipient mobile number
     */
    void sendOtp(String mobile);
}
