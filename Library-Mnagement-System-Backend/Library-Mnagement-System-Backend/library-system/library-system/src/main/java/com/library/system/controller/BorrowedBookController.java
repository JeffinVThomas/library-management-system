package com.library.system.controller;

import com.library.system.model.BorrowedBook;
import com.library.system.service.BorrowedBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // adjust for frontend IP if needed
public class BorrowedBookController {

    private final BorrowedBookService borrowedBookService;

    @PostMapping("/user/{userId}/book/{bookId}")
    public BorrowedBook borrowBook(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestBody BorrowedBook bookData) {
        return borrowedBookService.borrowBook(userId, bookId, bookData);
    }

    @GetMapping("/user/{userId}")
    public List<BorrowedBook> getUserBorrowedBooks(@PathVariable Long userId) {
        return borrowedBookService.getBorrowedBooksByUser(userId);
    }
}
