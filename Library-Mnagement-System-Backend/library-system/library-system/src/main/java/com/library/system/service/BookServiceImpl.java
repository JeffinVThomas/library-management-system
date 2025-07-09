package com.library.system.service;

import com.library.system.model.Book;
import com.library.system.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for handling book-related operations like
 * adding, deleting, fetching, and filtering books by category or availability.
 */
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * Adds a new book to the repository.
     *
     * @param book the book to add
     * @return the saved book
     */
    @Override
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    /**
     * Retrieves all books from the repository.
     *
     * @return list of all books
     */
    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Retrieves all books that are marked as available.
     *
     * @return list of available books
     */
    @Override
    public List<Book> getAvailableBooks() {
        return bookRepository.findByAvailableCopiesGreaterThan(0);  // ✅ new
    }

    /**
     * Retrieves books filtered by category.
     *
     * @param category the category to filter
     * @return list of books in the category
     */
    @Override
    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    /**
     * Retrieves available books filtered by category.
     *
     * @param category the category to filter
     * @return list of available books in the category
     */
    @Override
    public List<Book> getAvailableBooksByCategory(String category) {
        return bookRepository.findByCategoryAndAvailableTrue(category);
    }

    /**
     * Deletes a book by its ID.
     *
     * @param id the ID of the book to delete
     */
    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    /**
     * Returns the total count of books in the repository.
     *
     * @return number of books
     */
    @Override
    public long getBookCount() {
        return bookRepository.count();
    }

    /**
     * Returns the count of books that are available.
     *
     * @return number of available books
     */
    @Override
    public long getAvailableBookCount() {
        return bookRepository.findByAvailableTrue().size();
    }

    /**
     * Finds a book by its ID.
     *
     * @param id the ID of the book
     * @return optional book object
     */
    @Override
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    /**
     * Returns a list of distinct categories from the books.
     *
     * @return list of categories
     */
    @Override
    public List<String> getAllCategories() {
        return bookRepository.findDistinctCategories();
    }
}
