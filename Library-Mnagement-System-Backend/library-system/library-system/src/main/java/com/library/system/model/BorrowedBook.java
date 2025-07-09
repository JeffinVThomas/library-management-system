package com.library.system.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a record of a book borrowed by a user.
 * Includes borrow/return dates, fine status, and return status.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowedBook {

    /**
     * Unique ID for each borrowed book record.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user who borrowed the book.
     */
    @ManyToOne
    private User user;

    /**
     * The book that was borrowed.
     */
    @ManyToOne
    private Book book;

    /**
     * Date when the book was borrowed.
     */
    private LocalDate borrowDate;

    /**
     * Expected return date for the book.
     */
    private LocalDate returnDate;

    /**
     * Indicates if the user has paid the fine (if any).
     */
    private boolean finePaid;

    /**
     * Indicates if the book has been returned.
     * true = returned, false = not returned yet.
     */
    private boolean returned;

    /**
     * Status of the borrowing record: "Pending", "Returned", or "Fine".
     */
    private String status;
}
