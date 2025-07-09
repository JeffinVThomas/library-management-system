package com.library.system.controller;

import com.library.system.model.Book;
import com.library.system.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing books in the library system.
 * Provides endpoints for adding, retrieving, and deleting books,
 * as well as category and statistics APIs.
 */
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    @Autowired
    private BookService bookService;

    /**
     * Adds a new book to the system.
     * Only accessible by admin users.
     *
     * @param book the book to be added
     * @return the saved book
     */
    @PreAuthorize("hasAuthority('admin')")
    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    /**
     * Retrieves all books (regardless of availability).
     *
     * @return list of all books
     */
    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    /**
     * Retrieves only the available books.
     *
     * @return list of available books
     */
    @GetMapping("/available")
    public List<Book> getAvailableBooks() {
        return bookService.getAvailableBooks();
    }

    /**
     * Retrieves available books filtered by category.
     *
     * @param category the category to filter by
     * @return list of available books in the specified category
     */
    @GetMapping("/category/{category}")
    public List<Book> getAvailableBooksByCategory(@PathVariable String category) {
        return bookService.getAvailableBooksByCategory(category);
    }

    /**
     * Deletes a book by its ID.
     * Only accessible by admin users.
     *
     * @param id the ID of the book to delete
     */
    @PreAuthorize("hasAuthority('admin')")
    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    /**
     * Returns the total count of books.
     * Accessible by both admin and user roles.
     *
     * @return total number of books
     */
    @PreAuthorize("hasAnyAuthority('admin', 'user')")
    @GetMapping("/count")
    public long getBookCount() {
        return bookService.getBookCount();
    }

    /**
     * Returns the count of available books.
     * Accessible by both admin and user roles.
     *
     * @return count of available books
     */
    @PreAuthorize("hasAnyAuthority('admin', 'user')")
    @GetMapping("/count/available")
    public long getAvailableBookCount() {
        return bookService.getAvailableBookCount();
    }

    /**
     * Retrieves a book by its ID.
     *
     * @param id the ID of the book
     * @return the book if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id).orElse(null);
        if (book != null) {
            return ResponseEntity.ok(book);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Retrieves a list of all book categories.
     *
     * @return list of unique categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = bookService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
