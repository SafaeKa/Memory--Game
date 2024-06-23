package com.example.backend;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlayerRankDTO {
    private PlayerEntity player;
    private int rank;
}
