package com.example.backend;

import com.example.backend.exceptions.InvalidArgumentException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;


    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<PlayerEntity> getAllPlayersWithRanks() {
        List<PlayerEntity> players = playerRepository.findAll();
        List<PlayerEntity> sortedPlayers = players.stream()
                .sorted(Comparator.comparingInt(PlayerEntity::getScore).reversed())
                .collect(Collectors.toList());

        for (int i = 0; i < sortedPlayers.size(); i++) {
            sortedPlayers.get(i).setRank(i + 1);
        }
        return sortedPlayers;
    }

    //retrieves a player from the database by id
    public Optional<PlayerEntity> getPlayer(Long id) throws InvalidArgumentException {
        Optional<PlayerEntity> playerById = playerRepository.findById(id);
        //One line is ignored here
        if (playerById.isPresent()){
            return playerById;
        } else{
            throw new InvalidArgumentException();
        }
    }

    //save a new player to the database
    public PlayerEntity createPlayer(PlayerEntity newPlayer) throws InvalidArgumentException{
        if (newPlayer.getName()==null || newPlayer.getScore()==null){
            throw new InvalidArgumentException();
        }
        return playerRepository.save(newPlayer);
    }

    //delete and put not necessary?
}
