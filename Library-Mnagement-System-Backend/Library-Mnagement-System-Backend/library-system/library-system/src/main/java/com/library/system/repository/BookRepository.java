package com.library.system.repository;

import com.library.system.model.Book;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface BookRepository extends JpaRepository<Book, Long> {
	
	  List<Book> findByCategory(String category);
	  List<Book> findByAvailableTrue();
	  List<Book> findByCategoryAndAvailableTrue(String category);
	  @Query("SELECT DISTINCT b.category FROM Book b")
	    List<String> findDistinctCategories();
}	
