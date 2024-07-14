import Timer from "./timer.js";
import Card from "./card.js";
import Player from "./player.js";

class Game {
    constructor() {
        this.gridContainer = document.querySelector(".grid-container");
        this.numberCards = 4; //default number
        this.cardsAll = [];
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.init();
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const difficulty = urlParams.get('difficulty');
        const theme = urlParams.get('theme');
        const numberPlayers = urlParams.get('player');

        this.player1 = this.createPlayer(urlParams.get('player1Name'));
        this.player2 = null;
        if (numberPlayers === "two") {
            this.player2 = this.createPlayer(urlParams.get('player2Name'));
        }

        if (difficulty) {
            this.numberCards = parseInt(difficulty);
        }

        this.currentPlayer = this.player1;

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

        this.fetchThemeCards(theme);
    }

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
        if (this.player2) {
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

                if (this.player2) {
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
        //After both cards have been revealed, they remain revealed for a short time so that the player can remember the second motive until they are turned over again
        setTimeout(() => {
            this.firstCard.classList.remove("flipped");
            this.secondCard.classList.remove("flipped");
            this.resetBoard();
            if (this.player2) {
                this.switchPlayer();
            }
        }, 1000);

    }

    scoreIncrement() {
        let allMatchesFound = false;
        this.currentPlayer.incrementScore();
        this.player1.updateScore(1);
        if (this.player2) {
            this.player2.updateScore(2);
            if (this.player1.score + this.player2.score === this.numberCards) {
                allMatchesFound = true;
            }
        } else {
            if (this.player1.score === this.numberCards) {
                allMatchesFound = true;
            }
        }

        if (allMatchesFound) {
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
