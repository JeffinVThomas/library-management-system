package com.library.system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.system.model.BorrowedBook;
import com.library.system.model.User;

public interface BorrowedBookRepository extends JpaRepository<BorrowedBook, Long> {
    List<BorrowedBook> findByUser(User user);
}

