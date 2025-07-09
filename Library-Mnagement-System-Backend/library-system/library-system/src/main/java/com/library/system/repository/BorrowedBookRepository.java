package com.library.system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.system.model.Book;
import com.library.system.model.BorrowedBook;
import com.library.system.model.User;

/**
 * Repository interface for BorrowedBook entity.
 * Provides methods to fetch borrowed book records based on user and return status.
 */
public interface BorrowedBookRepository extends JpaRepository<BorrowedBook, Long> {

    /**
     * Finds all borrowed books by a specific user.
     *
     * @param user the user whose borrowed books are to be retrieved
     * @return a list of borrowed books for the given user
     */
    List<BorrowedBook> findByUser(User user);

    /**
     * Finds borrowed books that are due on a specific date and not yet returned.
     * Typically used for reminder notifications.
     *
     * @param returnDate the due date
     * @param returned whether the book has been returned
     * @return a list of borrowed books due on the given date and not yet returned
     */
    List<BorrowedBook> findByReturnDateAndReturned(LocalDate returnDate, boolean returned);

    /**
     * Finds all borrowed books that were returned and their return date is older than a given cutoff.
     *
     * @param cutoffDate the date before which returned books should be deleted
     * @return a list of old returned books
     */
    List<BorrowedBook> findByReturnedTrueAndReturnDateBefore(LocalDate cutoffDate);

    /**
     * Counts the number of borrowed books that are not yet returned.
     *
     * @return the total count of currently borrowed books
     */
    long countByReturnedFalse();
    boolean existsByUserAndBookAndReturnedFalse(User user, Book book);

}
