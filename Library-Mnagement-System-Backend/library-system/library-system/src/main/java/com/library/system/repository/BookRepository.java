package com.library.system.repository;

import com.library.system.model.Book;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Repository interface for Book entity.
 * Provides CRUD operations and custom queries for books.
 */
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Finds all books by the specified category.
     *
     * @param category the book category
     * @return a list of books in that category
     */
    List<Book> findByCategory(String category);

    /**
     * Finds all books that are currently available for borrowing.
     *
     * @return a list of available books
     */
    List<Book> findByAvailableTrue();

    /**
     * Finds available books in a specific category.
     *
     * @param category the book category
     * @return a list of available books in that category
     */
    List<Book> findByCategoryAndAvailableTrue(String category);

    /**
     * Retrieves a distinct list of all book categories in the database.
     *
     * @return a list of unique category names
     */
    @Query("SELECT DISTINCT b.category FROM Book b")
    List<String> findDistinctCategories();
    
    List<Book> findByAvailableCopiesGreaterThan(int count);

}
