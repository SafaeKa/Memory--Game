const gridContainer = document.querySelector(".grid-container"); //reference to grid container
let numberCards = 4; //default number

//extracting the difficulty level and the theme
const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');
const theme = urlParams.get('theme');
const numberPlayers = urlParams.get('player')
const player1 = (urlParams.get('player1Name')).charAt(0).toUpperCase() + (urlParams.get('player1Name')).slice(1);
let player2 = 0;
if (numberPlayers === "two") {
    player2 = (urlParams.get('player2Name')).charAt(0).toUpperCase() + (urlParams.get('player2Name')).slice(1);
}
if (difficulty) {
    numberCards = parseInt(difficulty);
}

let cards = [];
let cardsAll = [];
let firstCard, secondCard; //cards which are compared
let lockBoard = false; //match
let scorePlayer1 = 0;
let textScorePlayer1 = "Score " + player1 + ": ";
let attemptsPlayer1 = 0;
let textAttemptsPlayer1 = "Attempts " + player1 + ": ";
let scorePlayer2 = 0;
let attemptsPlayer2 = 0;
let textScorePlayer2 = 0;
let textAttemptsPlayer2 = 0;
if (numberPlayers === "two") {
    textScorePlayer2 = "Score " + player2 + ": ";
    textAttemptsPlayer2 = "Attempts " + player2 + ": ";
}
let timerInterval; // Timer interval ID
let totalSeconds; // Total seconds elapsed
let currentPlayer = player1
let timerLength;

if (numberPlayers === "solo"){
    textScorePlayer1 = "Score: "
    textAttemptsPlayer1 = "Attempts: "
}

document.querySelector(".attemptsPlayer1").textContent = textAttemptsPlayer1 + attemptsPlayer1;
document.querySelector(".scorePlayer1").textContent =  textScorePlayer1 + scorePlayer1;
if (numberPlayers === "two") {
    document.querySelector(".attemptsPlayer2").textContent = textAttemptsPlayer2 + attemptsPlayer2;
    document.querySelector(".scorePlayer2").textContent = textScorePlayer2 + scorePlayer2;
}

if (difficulty === "4"){
    timerLength = 30;
}
if (difficulty === "6"){
    timerLength = 45;
}
if (difficulty === "9"){
    timerLength = 75;
}
totalSeconds = timerLength;


//part responsible for getting the cards
fetch(theme)
    .then((res) => res.json())
    .then((data) => {
        cardsAll = [...data];
        shuffleCards();
        generateCards();
        startTimer(); // Start the timer when the game starts
    });


function shuffleCards() {
    let currentIndex = cardsAll.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cardsAll[currentIndex];
        cardsAll[currentIndex] = cardsAll[randomIndex];
        cardsAll[randomIndex] = temporaryValue;
    }
    cards = [...cardsAll.slice(0, numberCards), ...cardsAll.slice(0, numberCards)]; //copy every data value -> twice, second argument of slice is number of cards
    currentIndex = cards.length;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}


function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
        <div class="front">
        <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
        if (numberPlayers === "two") {
            document.querySelector(".player").textContent = currentPlayer + ", it's you're turn!";
        }
        else
            document.querySelector(".player").textContent = "Have fun, " + currentPlayer + "!";
        { setTimeout(() => {
            document.querySelector(".player").textContent = ""
        }, 10000);}

        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}
function game(){

    if (currentPlayer === player1){
        currentPlayer = player2
    }
    else if (currentPlayer === player2){
        currentPlayer = player1
    }
    document.querySelector(".player").textContent = currentPlayer + ", it's you're turn!";
}


function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    currentPlayer === player1 ? attemptsPlayer1++ : attemptsPlayer2 ++;
    document.querySelector(".attemptsPlayer1").textContent = textAttemptsPlayer1 + attemptsPlayer1;
    if (numberPlayers === "two") {
        document.querySelector(".attemptsPlayer2").textContent = textAttemptsPlayer2 + attemptsPlayer2;
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
    currentPlayer === player1 ? scorePlayer1++ : scorePlayer2 ++;
    document.querySelector(".scorePlayer1").textContent = textScorePlayer1+ scorePlayer1;
    if (numberPlayers === "two") {
        document.querySelector(".scorePlayer2").textContent = textScorePlayer2 + scorePlayer2;
    }

    if (scorePlayer1 + scorePlayer2 === numberCards ) { // Check if all matches are found
        clearInterval(timerInterval); // Stop the timer
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

function restart() {
    resetBoard();
    shuffleCards();
    scorePlayer1 = 0;
    attemptsPlayer1 = 0;
    scorePlayer2 = 0;
    attemptsPlayer2 = 0;
    totalSeconds = timerLength; // Reset total seconds
    document.querySelector(".attemptsPlayer1").textContent = textAttemptsPlayer1 + attemptsPlayer1;
    document.querySelector(".scorePlayer1").textContent = textScorePlayer1 + scorePlayer1;

    if (numberPlayers === "two"){
        document.querySelector(".attemptsPlayer2").textContent = textAttemptsPlayer2 + attemptsPlayer2;
        document.querySelector(".scorePlayer2").textContent = textScorePlayer2 + scorePlayer2;

    }
    document.querySelector(".timer").textContent = "00:00"; // Reset timer display
    clearInterval(timerInterval); // Clear existing timer interval
    startTimer(); // Start the timer again
    gridContainer.innerHTML = "";
    generateCards();
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

function updateTimer() {
    totalSeconds--;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = padZero(minutes) + ":" + padZero(seconds);
    document.querySelector(".timer").textContent = formattedTime;
    if (totalSeconds === 0){
        console.log ("finish");
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

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}
async function saveScores() {
    const url = 'http://localhost:8080/player';
    const scores = numberPlayers === "two" ?
        [{ name: player1, score: scorePlayer1 }, { name: player2, score: scorePlayer2 }] :
        [{ name: player1, score: scorePlayer1 }];

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

