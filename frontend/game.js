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
//geändert
const player1Name = (urlParams.get('player1Name')).charAt(0).toUpperCase() + (urlParams.get('player1Name')).slice(1);
const player1 = new Player(player1Name);

let player2 = null;
if (numberPlayers === "two") {
    const player2Name = (urlParams.get('player2Name')).charAt(0).toUpperCase() + (urlParams.get('player2Name')).slice(1);
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

/*if (numberPlayers === "solo") {
    player1.getScoreText = () => "Score: ";
    player1.getAttemptsText = () => "Attempts: ";
}*/

document.querySelector(".attemptsPlayer1").textContent = player1.getAttemptsText();
document.querySelector(".scorePlayer1").textContent = player1.getScoreText();
if (numberPlayers === "two") {
    document.querySelector(".attemptsPlayer2").textContent = player2.getAttemptsText();
    document.querySelector(".scorePlayer2").textContent = player2.getScoreText();
}
let timerLength;
let timerInitialState;

if (difficulty === "4"){
    timerLength = 30;
    timerInitialState = "00:30";
}
if (difficulty === "6"){
    timerLength = 45;
    timerInitialState = "00:45"
}
if (difficulty === "9"){
    timerLength = 75;
    timerInitialState = "01:15"
}
//totalSeconds = timerLength;
document.querySelector(".timer").textContent = "" + timerInitialState;
const gameTimer = new Timer(timerLength, ".timer");
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

//part responsible for getting the cards
fetch(theme)
    .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch theme');
        return res.json();
    })
    .then((data) => {
        cardsAll = [...data];
        shuffleCards();
        generateCards();
        gameTimer.start();
        if (numberPlayers === "two") {
            document.querySelector(".player").textContent = currentPlayer.name + ", it's your turn!";
        } else {
            document.querySelector(".player").textContent = "Have fun, " + currentPlayer.name + "!";
            setTimeout(() => {
                document.querySelector(".player").textContent = "";
            }, 10000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });


function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

function shuffleCards() {
    shuffleArray(cardsAll);
    cards = [...cardsAll.slice(0, numberCards), ...cardsAll.slice(0, numberCards)];
    shuffleArray(cards);
}



function generateCards() {
    for (let cardData of cards) {
        const card = new Card(cardData.name, cardData.image, flipCard);
        gridContainer.appendChild(card.cardElement);
    }

}
function game(){

    if (currentPlayer === player1){
        currentPlayer = player2
    }
    else if (currentPlayer === player2){
        currentPlayer = player1
    }
    document.querySelector(".player").textContent = currentPlayer.name + ", it's you're turn!";
}


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
    document.querySelector(".attemptsPlayer1").textContent = player1.getAttemptsText();
    if (numberPlayers === "two") {
        document.querySelector(".attemptsPlayer2").textContent = player2.getAttemptsText();
    }
    lockBoard = true;

    checkForMatch();
}


function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? (disableCards(), scoreIncrement()) : unflipCards();
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
    document.querySelector(".scorePlayer1").textContent = player1.getScoreText();
    if (numberPlayers === "two") {
        document.querySelector(".scorePlayer2").textContent = player2.getScoreText();
        if (player1.score + player2.score === numberCards ){
            allMatchesFound = true;
        }
    } else {
        if (player1.score === numberCards ){
            allMatchesFound = true;
        }
    }

    if (allMatchesFound) { // Check if all matches are found
        gameTimer.stop(); // Stop the timer
        saveScores()
            .then(() => {
                // Redirect to scores.html after saving scores
                window.location.href = 'scores.html';
            })
            .catch(error => {
                console.error('Error saving scores:', error);
            });
    }
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

