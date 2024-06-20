package com.example.backend;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "players")
public class PlayerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //beware that the long variable may cause problems, int?

    @Column(name = "name")
    private String name;

    @Column(name = "rank")
    private Integer rank;

    @Column(name="score")
    private Integer score;

}

