package com.library.system.controller;

import com.library.system.model.BorrowedBook;
import com.library.system.service.BorrowedBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST controller for managing borrowed books in the library.
 */
@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BorrowedBookController {

    private final BorrowedBookService borrowedBookService;

    /**
     * Allows a user to borrow a book.
     *
     * @param userId   ID of the user borrowing the book
     * @param bookId   ID of the book to borrow
     * @param bookData BorrowedBook data including borrow and return dates
     * @return the borrowed book record or error message
     */
    @PostMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<?> borrowBook(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestBody BorrowedBook bookData) {
        try {
            BorrowedBook borrowed = borrowedBookService.borrowBook(userId, bookId, bookData);
            return ResponseEntity.ok(borrowed);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Retrieves all books borrowed by a specific user.
     *
     * @param userId the user ID
     * @return list of borrowed books by the user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowedBook>> getUserBorrowedBooks(@PathVariable Long userId) {
        List<BorrowedBook> books = borrowedBookService.getBorrowedBooksByUser(userId);
        return ResponseEntity.ok(books);
    }

    /**
     * Returns a borrowed book.
     *
     * @param borrowId the borrow record ID
     * @return message indicating the result of the return operation
     */
    @PutMapping("/return/{borrowId}")
    public ResponseEntity<Map<String, String>> returnBook(@PathVariable Long borrowId) {
        try {
            BorrowedBook result = borrowedBookService.returnBook(borrowId);
            Map<String, String> response = new HashMap<>();

            if (result == null) {
                response.put("message", "Borrow record not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            } else if ("Fine".equals(result.getStatus())) {
                response.put("message", "Book returned late. Fine applied.");
            } else if ("Borrow Cancelled".equals(result.getStatus())) {
                response.put("message", "Borrow cancelled due to invalid dates.");
            } else {
                response.put("message", "Book returned successfully.");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred while returning the book."));
        }
    }

    /**
     * Gets the total number of currently borrowed books.
     *
     * @return count of borrowed books
     */
    @PreAuthorize("hasAnyAuthority('admin', 'user')")
    @GetMapping("/count/borrowed")
    public ResponseEntity<Long> getBorrowedBookCount() {
        return ResponseEntity.ok(borrowedBookService.getBorrowedBookCount());
    }

    /**
     * Calculates fine for a specific borrow record.
     *
     * @param borrowId the borrow record ID
     * @return map containing the fine amount
     */
    @GetMapping("/fine/{borrowId}")
    public ResponseEntity<Map<String, Integer>> getFine(@PathVariable Long borrowId) {
        try {
            BorrowedBook book = borrowedBookService.getBorrowById(borrowId);
            int fine = borrowedBookService.calculateFine(book);
            return ResponseEntity.ok(Map.of("fine", fine));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("fine", 0));
        }
    }

    /**
     * Checks if a user is eligible to borrow books.
     *
     * @param userId the user ID
     * @return map indicating whether the user can borrow
     */
    @GetMapping("/can-borrow/{userId}")
    public ResponseEntity<Map<String, Boolean>> canUserBorrow(@PathVariable Long userId) {
        boolean canBorrow = borrowedBookService.canUserBorrow(userId);
        return ResponseEntity.ok(Map.of("canBorrow", canBorrow));
    }

    /**
     * Returns the total unpaid fine and whether the user currently has any fines.
     *
     * @param userId the user ID
     * @return map containing hasFine flag and total fine amount
     */
    @GetMapping("/fine-status/{userId}")
    public ResponseEntity<Map<String, Object>> getUserFineStatus(@PathVariable Long userId) {
        List<BorrowedBook> borrowedBooks = borrowedBookService.getBorrowedBooksByUser(userId);
        int totalFine = 0;
        boolean hasFine = false;

        for (BorrowedBook book : borrowedBooks) {
            if (!book.isReturned()) {
                int fine = borrowedBookService.calculateFine(book);
                if (fine > 0) {
                    totalFine += fine;
                    hasFine = true;
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("hasFine", hasFine);
        response.put("fineAmount", totalFine);

        return ResponseEntity.ok(response);
    }

    /**
     * Checks if the user has already borrowed a specific book and not yet returned it.
     *
     * @param userId the user ID
     * @param bookId the book ID
     * @return map indicating if the book is already borrowed by the user
     */
    @GetMapping("/user/{userId}/book/{bookId}/already-borrowed")
    public ResponseEntity<Map<String, Boolean>> hasUserAlreadyBorrowed(
            @PathVariable Long userId,
            @PathVariable Long bookId) {
        boolean alreadyBorrowed = borrowedBookService.hasUserAlreadyBorrowedBook(userId, bookId);
        return ResponseEntity.ok(Map.of("alreadyBorrowed", alreadyBorrowed));
    }
}
