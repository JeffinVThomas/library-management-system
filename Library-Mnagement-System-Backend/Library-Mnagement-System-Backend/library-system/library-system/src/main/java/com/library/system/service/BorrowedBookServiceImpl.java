package com.library.system.service;

import com.library.system.model.Book;
import com.library.system.model.BorrowedBook;
import com.library.system.model.User;
import com.library.system.repository.BookRepository;
import com.library.system.repository.BorrowedBookRepository;
import com.library.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowedBookServiceImpl implements BorrowedBookService {

    private final BorrowedBookRepository borrowedBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    public BorrowedBook borrowBook(Long userId, Long bookId, BorrowedBook bookData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BorrowedBook borrowed = new BorrowedBook();
        borrowed.setUser(user);
        borrowed.setBook(book);
        borrowed.setBorrowDate(bookData.getBorrowDate());
        borrowed.setReturnDate(bookData.getReturnDate());

        return borrowedBookRepository.save(borrowed);
    }

    @Override
    public List<BorrowedBook> getBorrowedBooksByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return borrowedBookRepository.findByUser(user);
    }
}
