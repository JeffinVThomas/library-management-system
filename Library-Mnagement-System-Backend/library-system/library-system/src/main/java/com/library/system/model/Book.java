package com.library.system.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a book in the Library Management System.
 * Supports tracking multiple physical copies.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    /**
     * Auto-generated unique ID for each book.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Title of the book.
     */
    private String title;

    /**
     * Author of the book.
     */
    private String author;

    /**
     * Category or genre of the book.
     */
    private String category;

    /**
     * Total number of copies of this book in the library.
     */
    private int totalCopies;

    /**
     * Number of copies currently available for borrowing.
     */
    private int availableCopies;

    /**
     * Availability status of the book.
     * True if at least one copy is available for borrowing.
     */
    private boolean available = true;

    /**
     * URL or path to the book's cover image.
     */
    private String cover;

    /**
     * Detailed description or summary of the book.
     */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
}
