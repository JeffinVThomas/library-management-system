package com.library.system.service;


import com.library.system.model.BorrowedBook;
import com.library.system.model.User;

import java.util.List;

import org.springframework.stereotype.Service;
@Service
public interface BorrowedBookService {
    BorrowedBook borrowBook(Long userId, Long bookId,BorrowedBook bookData);
    List<BorrowedBook> getBorrowedBooksByUser(Long userId);
}

