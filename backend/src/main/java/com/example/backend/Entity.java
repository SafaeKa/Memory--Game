package com.example.backend;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
@jakarta.persistence.Entity
@Table(name = "players")
public class Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id; //beware that the long variable may cause problems, int?

    @Column(name = "name")
    private String name;

    @Column(name = "rank")
    private int rank;

    @Column(name="score")
    private int score;

    public Entity (){ this.id = IdGenerator.generateId();}
}
