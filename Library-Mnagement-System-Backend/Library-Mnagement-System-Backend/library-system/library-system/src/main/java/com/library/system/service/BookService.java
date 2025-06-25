package com.library.system.service;
import com.library.system.model.Book;
import java.util.List;
import java.util.Optional;

public interface BookService {

    Book addBook(Book book);

    List<Book> getAllBooks();

    List<Book> getAvailableBooks();

    List<Book> getBooksByCategory(String category);

    List<Book> getAvailableBooksByCategory(String category);

    void deleteBook(Long id);
    
    long getBookCount();
    
    long getAvailableBookCount();
    
    long getBorrowedBookCount();
    
    Optional<Book> getBookById(Long id);
    
    List<String> getAllCategories();
    
    
}

