package com.library.system.repository;

import com.library.system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides basic CRUD operations and custom user queries.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by email.
     *
     * @param email the user's email
     * @return an Optional containing the User if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user exists with the given email.
     *
     * @param email the email to check
     * @return true if a user exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Finds a user by mobile number.
     *
     * @param mobile the user's mobile number
     * @return an Optional containing the User if found
     */
    Optional<User> findByMobile(String mobile);

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
     * @param role the user role (e.g., "admin", "user")
     * @return true if at least one user has that role
     */
    boolean existsByRole(String role);
}
