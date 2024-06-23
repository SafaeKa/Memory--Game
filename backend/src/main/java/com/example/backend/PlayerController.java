package com.example.backend;

import com.example.backend.exceptions.InvalidArgumentException;
import org.hibernate.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;
import java.util.Optional;

@RestController
public class PlayerController {
    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    //return all players in the database
    @GetMapping(path="/player", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PlayerEntity>> getAllPlayers(){
        List<PlayerEntity> allPlayersWithRanks = playerService.getAllPlayersWithRanks();
        return new ResponseEntity<>(allPlayersWithRanks, HttpStatus.OK);
    }


    //get a specific plaer from the database
    @GetMapping(path="/player/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Optional<PlayerEntity>> getPlayer(@PathVariable Long id){
        try {
            Optional<PlayerEntity> playerById = playerService.getPlayer(id);
            return new ResponseEntity<>(playerById, HttpStatus.OK);}
        catch (InvalidArgumentException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }

    @PostMapping(path = "/player", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PlayerEntity> createPlayer(@RequestBody PlayerEntity newPlayer){
        try {
            PlayerEntity createdPlayer = playerService.createPlayer(newPlayer);
            return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
        } catch (InvalidArgumentException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
