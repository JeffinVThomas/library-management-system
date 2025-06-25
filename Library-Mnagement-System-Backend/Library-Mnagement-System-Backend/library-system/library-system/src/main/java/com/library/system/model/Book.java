package com.library.system.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Book {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String category;
    private boolean available = true;
    
    private String cover;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
   
}
