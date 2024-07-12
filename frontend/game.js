import Timer from "./timer.js";
import Card from "./card.js";
import Player from "./player.js";

const gridContainer = document.querySelector(".grid-container"); //reference to grid container
let numberCards = 4; //default number

//extracting the difficulty level and the theme
const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');
const theme = urlParams.get('theme');
const numberPlayers = urlParams.get('player')

const player1Name = Player.capitalizeName(urlParams.get('player1Name'));
const player1 = new Player(player1Name);
let player2 = null;
if (numberPlayers === "two") {
    const player2Name = Player.capitalizeName(urlParams.get('player2Name'));
    player2 = new Player(player2Name);
}

if (difficulty) {
    numberCards = parseInt(difficulty);
}

let cards = [];
let cardsAll = [];
let firstCard, secondCard;
let lockBoard = false;
let currentPlayer = player1;

player1.updateAttempts(1);
player1.updateScore(1);

if (numberPlayers === "two") {
    player2.updateAttempts(2);
    player2.updateScore(2);
}

const gameTimer = new Timer(difficulty, ".timer");
gameTimer.onFinish = () => {
    console.log("finish");
    saveScores()
        .then(() => {
            window.location.href = 'scores.html';
        })
        .catch(error => {
            console.error('Error saving scores:', error);
        });
};


function flipCard(cardElement) {
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
}

//part responsible for getting the cards
fetch(theme)
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
    });

function game(){
    if (currentPlayer === player1){
        currentPlayer = player2
    }
    else if (currentPlayer === player2){
        currentPlayer = player1
    }
    currentPlayer.setPlayerMessage(`${currentPlayer.name}, it's your turn!`);
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        disableCards();
        scoreIncrement();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
        if (numberPlayers === "two") {
            game()
        }
    }, 1000);

}

function scoreIncrement(){
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
}

function allMatches(){
    gameTimer.stop(); // Stop the timer
    saveScores()
        //delete 162-169?
        .then(() => {
            // Redirect to scores.html after saving scores
            window.location.href = 'scores.html';
        })
        .catch(error => {
            console.error('Error saving scores:', error);
        });
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

window.restart = function() {
    window.location.reload();
}

async function saveScores() {
    let calculateScorePlayer1 = player1.score/player1.attempts*10;
    let calculateScorePlayer2 ;
    if (numberPlayers === "two"){
        calculateScorePlayer2 = player2.score/player2.attempts*10;
    }
    const url = 'http://localhost:8080/player';
    const scores = numberPlayers === "two" ?
        [{ name: player1.name, score: calculateScorePlayer1 }, { name: player2.name, score: calculateScorePlayer2 }] :
        [{ name: player1.name, score: calculateScorePlayer1 }];

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
}

