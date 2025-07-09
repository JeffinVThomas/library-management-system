package com.library.system.service;

import com.library.system.model.Book;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing books in the Library Management System.
 * Handles operations like adding, retrieving, filtering, and counting books.
 */
public interface BookService {

    /**
     * Adds a new book to the system.
     *
     * @param book the book to be added
     * @return the saved book
     */
    Book addBook(Book book);

    /**
     * Deletes a book by its ID.
     *
     * @param id the ID of the book to delete
     */
    void deleteBook(Long id);

    /**
     * Finds a book by its ID.
     *
     * @param id the ID of the book
     * @return an Optional containing the book if found
     */
    Optional<Book> getBookById(Long id);

    /**
     * Retrieves all books from the system.
     *
     * @return list of all books
     */
    List<Book> getAllBooks();

    /**
     * Retrieves all books that are available to be borrowed.
     *
     * @return list of available books
     */
    List<Book> getAvailableBooks();

    /**
     * Retrieves books by category.
     *
     * @param category the category to filter by
     * @return list of books in the given category
     */
    List<Book> getBooksByCategory(String category);

    /**
     * Retrieves only available books in the given category.
     *
     * @param category the category to filter by
     * @return list of available books in that category
     */
    List<Book> getAvailableBooksByCategory(String category);

    /**
     * Gets the total number of books in the system.
     *
     * @return total book count
     */
    long getBookCount();

    /**
     * Gets the number of books that are currently available.
     *
     * @return count of available books
     */
    long getAvailableBookCount();

    /**
     * Retrieves a list of all unique book categories.
     *
     * @return list of categories
     */
    List<String> getAllCategories();
}
