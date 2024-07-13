import Timer from "./timer.js";
import Card from "./card.js";
import Player from "./player.js";

class Game {
    constructor() {
        //Initializing HTML elements and game variables
        this.gridContainer = document.querySelector(".grid-container");
        this.numberCards = 4; //default number
        this.cardsAll = [];
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.init();
    }

    //Initialization method
    init() {
        //extract difficulty level and theme
        const urlParams = new URLSearchParams(window.location.search);
        const difficulty = urlParams.get('difficulty');
        const theme = urlParams.get('theme');
        const numberPlayers = urlParams.get('player');

        //Initialize players
        this.player1 = this.createPlayer(urlParams.get('player1Name'));
        this.player2 = null;
        if (numberPlayers === "two") {
            this.player2 = this.createPlayer(urlParams.get('player2Name'));
        }
        //set difficulty level
        if (difficulty) {
            this.numberCards = parseInt(difficulty);
        }

        this.currentPlayer = this.player1; //The player in the beginning is player 1

        //refresh attempts and scores of the players
        this.player1.updateAttempts(1);
        this.player1.updateScore(1);
        if (numberPlayers === "two") {
            this.player2.updateAttempts(2);
            this.player2.updateScore(2);
        }

        //Initialize the timer
        this.gameTimer = new Timer(difficulty, ".timer");
        this.gameTimer.onFinish = () => {
            this.saveScores();
        };

        //Call cards for the chosen theme
        this.fetchThemeCards(theme);
    }
    //End of Init

    //Helper method to create a player
    createPlayer(name) {
        return new Player(Player.capitalizeName(name));
    }

    flipCard(cardElement) {
        if (this.lockBoard) return;
        if (cardElement === this.firstCard) return;

        cardElement.classList.add("flipped");

        if (!this.firstCard) {
            this.firstCard = cardElement;
            return;
        }

        this.secondCard = cardElement;
        this.currentPlayer.incrementAttempts();
        this.player1.updateAttempts(1);
        if (this.player2) { //HMMMM
            this.player2.updateAttempts(2);
        }
        this.lockBoard = true;

        this.checkForMatch();
    }

    fetchThemeCards(theme) {
        fetch(theme)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch theme');
                return res.json();
            })
            .then((data) => {
                this.cardsAll = [...data];
                Card.shuffleArray(this.cardsAll, this.numberCards);
                Card.generateCards(this.gridContainer, this.cardsAll, this.numberCards, this.flipCard.bind(this));
                this.gameTimer.start();

                if (this.player2) { //HMMMM
                    this.currentPlayer.setPlayerMessage(`${this.currentPlayer.name}, it's your turn!`);
                } else {
                    this.currentPlayer.setPlayerMessage(`Have fun, ${this.currentPlayer.name}!`);
                    setTimeout(() => {
                        this.currentPlayer.setPlayerMessage("");
                    }, 10000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    checkForMatch() {
        let isMatch = this.firstCard.dataset.name === this.secondCard.dataset.name;
        if (isMatch) {
            this.disableCards();
            this.scoreIncrement();
        } else {
            this.unflipCards();
        }
    }

    disableCards() {
        this.firstCard.removeEventListener("click", this.flipCard);
        this.secondCard.removeEventListener("click", this.flipCard);

        this.resetBoard();
    }

    unflipCards() {
        //After both cards have been revealed, they remain revealed for a short time so that the player can remember the second motive until they are turned over again.
        setTimeout(() => {
            this.firstCard.classList.remove("flipped");
            this.secondCard.classList.remove("flipped");
            this.resetBoard();
            if (this.player2) { //HMMMM
                this.switchPlayer();
            }
        }, 1000);

    }

    scoreIncrement() {
        let allMatchesFound = false;
        this.currentPlayer.incrementScore();
        this.player1.updateScore(1);
        if (this.player2) { //HMMMM
            this.player2.updateScore(2);
            if (this.player1.score + this.player2.score === this.numberCards) {
                allMatchesFound = true;
            }
        } else {
            if (this.player1.score === this.numberCards) {
                allMatchesFound = true;
            }
        }

        if (allMatchesFound) { // Check if all matches are found
            this.allMatches();
        }
    }

    allMatches() {
        this.gameTimer.stop();
        this.saveScores();
    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
    }

    //switch players
    switchPlayer() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else if (this.currentPlayer === this.player2) {
            this.currentPlayer = this.player1;
        }
        this.currentPlayer.setPlayerMessage(`${this.currentPlayer.name}, it's your turn!`);
    }

    async saveScores() {
        let calculateScorePlayer1 = this.player1.score / this.player1.attempts * 10;
        let calculateScorePlayer2;
        if (this.player2) {
            calculateScorePlayer2 = this.player2.score / this.player2.attempts * 10;
        }
        const url = 'http://localhost:8080/player';

        let scores;

        if (this.player2) {
            scores = [
                {name: this.player1.name, score: calculateScorePlayer1},
                {name: this.player2.name, score: calculateScorePlayer2}
            ];
        } else {
            scores = [
                {name: this.player1.name, score: calculateScorePlayer1}
            ];
        }


        for (const player of scores) {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(player)
            });
            if (!response.ok) {
                console.error('Failed to save player score');
            }
        }

        window.location.href = 'scores.html';
    }
}

    window.onload = () => {
        new Game();
    }

    window.restart = function() {
        window.location.reload();
    }


/*const gridContainer = document.querySelector(".grid-container"); //reference to grid container
let numberCards = 4; //default number*/

//extracting the difficulty level and the theme
/*const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');
const theme = urlParams.get('theme');
const numberPlayers = urlParams.get('player');

const player1Name = Player.capitalizeName(urlParams.get('player1Name'));
const player1 = new Player(player1Name);
let player2 = null;
if (numberPlayers === "two") {
    const player2Name = Player.capitalizeName(urlParams.get('player2Name'));
    player2 = new Player(player2Name);
}*/

/*if (difficulty) {
    numberCards = parseInt(difficulty);
}*/


/*let cardsAll = [];
let firstCard, secondCard;
let lockBoard = false;
let currentPlayer = player1;*/

/*player1.updateAttempts(1);
player1.updateScore(1);

if (numberPlayers === "two") {
    player2.updateAttempts(2);
    player2.updateScore(2);
}*/

//const gameTimer = new Timer(difficulty, ".timer");

/*function flipCard(cardElement) {
    if (lockBoard) return;
    if (cardElement === firstCard) return;

    cardElement.classList.add("flipped");

    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    secondCard = cardElement;
    currentPlayer.incrementAttempts();
    player1.updateAttempts(1);
    if (numberPlayers === "two") {
        player2.updateAttempts(2);
    }
    lockBoard = true;

    checkForMatch();
}*/

//part responsible for getting the cards
/*fetch(theme)
    .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch theme');
        return res.json();
    })
    .then((data) => {
        cardsAll = [...data];
        Card.shuffleArray(cardsAll, numberCards);
        Card.generateCards(gridContainer, cardsAll, numberCards, flipCard);
        gameTimer.start();

        if (numberPlayers === "two") {
            currentPlayer.setPlayerMessage(`${currentPlayer.name}, it's your turn!`);
        } else {
            currentPlayer.setPlayerMessage(`Have fun, ${currentPlayer.name}!`);
            setTimeout(() => {
                currentPlayer.setPlayerMessage("");
            }, 10000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });*/

/*function game(){
    if (currentPlayer === player1){
        currentPlayer = player2
    }
    else if (currentPlayer === player2){
        currentPlayer = player1
    }
    currentPlayer.setPlayerMessage(`${currentPlayer.name}, it's your turn!`);
}*/

/*function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        disableCards();
        scoreIncrement();
    } else {
        unflipCards();
    }
}*/

/*function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}*/

/*function unflipCards() {
    //After both cards have been revealed, they remain revealed for a short time so that the player can remember the second motive until they are turned over again.
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
        if (numberPlayers === "two") {
            game()
        }
    }, 1000);

}*/

/*function scoreIncrement(){
    let allMatchesFound = false;
    currentPlayer.incrementScore();
    player1.updateScore(1);
    if (numberPlayers === "two") {
        player2.updateScore(2);
        if (player1.score + player2.score === numberCards ){
            allMatchesFound = true;
        }
    } else {
        if (player1.score === numberCards ){
            allMatchesFound = true;
        }
    }

    if (allMatchesFound) { // Check if all matches are found
        allMatches();
    }
}*/

/*function allMatches(){
    gameTimer.stop(); // Stop the timer
    saveScores()
}*/

/*function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}*/

/*window.restart = function() {
    window.location.reload();
}*/

/*gameTimer.onFinish = () => {
    saveScores();
};*/

/*async function saveScores() {
    let calculateScorePlayer1 = player1.score/player1.attempts*10;
    let calculateScorePlayer2 ;
    if (numberPlayers === "two"){
        calculateScorePlayer2 = player2.score/player2.attempts*10;
    }
    const url = 'http://localhost:8080/player';

    let scores;

    if (numberPlayers === "two") {
        scores = [
            { name: player1.name, score: calculateScorePlayer1 },
            { name: player2.name, score: calculateScorePlayer2 }
        ];
    } else {
        scores = [
            { name: player1.name, score: calculateScorePlayer1 }
        ];
    }


    // Save scores for each player
    for (const player of scores) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player)
        });
        if (!response.ok) {
            console.error('Failed to save player score');
        }
    }

    // Redirect to scores.html after saving scores
    window.location.href = 'scores.html';
}*/