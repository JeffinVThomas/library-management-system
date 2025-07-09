package com.library.system.service;

import com.library.system.model.Book;
import com.library.system.model.BorrowedBook;
import com.library.system.model.User;
import com.library.system.repository.BookRepository;
import com.library.system.repository.BorrowedBookRepository;
import com.library.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Service implementation for managing book borrowing and returning,
 * fine calculation, and user borrow eligibility.
 */
@Service
public class BorrowedBookServiceImpl implements BorrowedBookService {

    private final BorrowedBookRepository borrowedBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public BorrowedBookServiceImpl(
            BorrowedBookRepository borrowedBookRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {
        this.borrowedBookRepository = borrowedBookRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * Allows a user to borrow a book if eligible and copies are available.
     *
     * @param userId the ID of the user borrowing the book
     * @param bookId the ID of the book to borrow
     * @param bookData contains borrow and return dates
     * @return the saved BorrowedBook record
     * @throws RuntimeException if user not eligible, book unavailable, or already borrowed
     */
    @Override
    public BorrowedBook borrowBook(Long userId, Long bookId, BorrowedBook bookData) {
        boolean canBorrow = canUserBorrow(userId);
        if (!canBorrow) {
            throw new RuntimeException("You have overdue books. Return them before borrowing new ones.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available for this book.");
        }

        if (borrowedBookRepository.existsByUserAndBookAndReturnedFalse(user, book)) {
            throw new RuntimeException("You have already borrowed this book.");
        }

        BorrowedBook borrowed = new BorrowedBook();
        borrowed.setUser(user);
        borrowed.setBook(book);
        borrowed.setBorrowDate(bookData.getBorrowDate());
        borrowed.setReturnDate(bookData.getReturnDate());
        borrowed.setReturned(false);
        borrowed.setFinePaid(false);
        borrowed.setStatus("Pending");

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        book.setAvailable(book.getAvailableCopies() > 0);

        bookRepository.save(book);
        return borrowedBookRepository.save(borrowed);
    }

    /**
     * Retrieves all borrowed books for a user.
     *
     * @param userId the user ID
     * @return list of borrowed books
     * @throws RuntimeException if user not found
     */
    @Override
    public List<BorrowedBook> getBorrowedBooksByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return borrowedBookRepository.findByUser(user);
    }

    /**
     * Processes the return of a borrowed book and updates records.
     *
     * @param borrowId the borrow record ID
     * @return updated BorrowedBook record
     * @throws RuntimeException if borrow record not found
     */
    @Override
    public BorrowedBook returnBook(Long borrowId) {
        BorrowedBook borrowedBook = borrowedBookRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        LocalDate today = LocalDate.now();
        LocalDate borrowDate = borrowedBook.getBorrowDate();
        LocalDate returnDate = borrowedBook.getReturnDate();

        Book book = borrowedBook.getBook();

        book.setAvailableCopies(book.getAvailableCopies() + 1);
        book.setAvailable(true);

        bookRepository.save(book);
        borrowedBook.setReturned(true);

        if (borrowDate != null && borrowDate.isAfter(today)) {
            borrowedBook.setStatus("Borrow Cancelled");
        } else if (returnDate != null && returnDate.isBefore(today)) {
            borrowedBook.setStatus("Fine");
        } else {
            borrowedBook.setStatus("Returned");
        }

        return borrowedBookRepository.save(borrowedBook);
    }

    /**
     * Checks if a user can borrow new books (no overdue books).
     *
     * @param userId the user ID
     * @return true if eligible, false otherwise
     * @throws RuntimeException if user not found
     */
    @Override
    public boolean canUserBorrow(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        List<BorrowedBook> books = borrowedBookRepository.findByUser(user);

        for (BorrowedBook book : books) {
            if (!book.isReturned() &&
                book.getReturnDate() != null &&
                book.getReturnDate().isBefore(today)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gets the total count of borrowed books that are not yet returned.
     *
     * @return count of currently borrowed books
     */
    @Override
    public long getBorrowedBookCount() {
        return borrowedBookRepository.countByReturnedFalse();
    }

    /**
     * Calculates the fine for a borrowed book based on overdue days.
     *
     * @param borrowedBook the borrowed book record
     * @return fine amount (0 if none)
     */
    @Override
    public int calculateFine(BorrowedBook borrowedBook) {
        if (borrowedBook == null || borrowedBook.isReturned() || borrowedBook.isFinePaid()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        LocalDate returnDate = borrowedBook.getReturnDate();

        if (returnDate != null && today.isAfter(returnDate)) {
            long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(returnDate, today);
            return (int) (daysOverdue * 10);
        }

        return 0;
    }

    /**
     * Finds a borrow record by its ID.
     *
     * @param borrowId the borrow record ID
     * @return the BorrowedBook object
     * @throws RuntimeException if borrow record not found
     */
    @Override
    public BorrowedBook getBorrowById(Long borrowId) {
        return borrowedBookRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));
    }

    /**
     * Calculates the total unpaid fine amount for a user.
     *
     * @param userId the user ID
     * @return total unpaid fine
     */
    @Override
    public int getTotalUnpaidFineForUser(Long userId) {
        List<BorrowedBook> books = getBorrowedBooksByUser(userId);
        int totalFine = 0;

        for (BorrowedBook book : books) {
            if (!book.isReturned()) {
                int fine = calculateFine(book);
                if (fine > 0) {
                    totalFine += fine;
                }
            }
        }

        return totalFine;
    }

    /**
     * Checks if a user has already borrowed a specific book and not returned it.
     *
     * @param userId the user ID
     * @param bookId the book ID
     * @return true if already borrowed and not returned; false otherwise
     * @throws RuntimeException if user or book not found
     */
    @Override
    public boolean hasUserAlreadyBorrowedBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return borrowedBookRepository.existsByUserAndBookAndReturnedFalse(user, book);
    }
}
