const gridContainer = document.querySelector(".grid-container"); //reference to grid container
let cards = [];
let cardsAll = [];
let firstCard, secondCard; //cards which are compared
let lockBoard = false; //match
let scorePlayer1 = 0;
let attemptsPlayer1 = 0;
let scorePlayer2 = 0;
let attemptsPlayer2 = 0;
let numberCards = 4; //default number
let timerInterval; // Timer interval ID
let totalSeconds = 0; // Total seconds elapsed
const player1 = "player1"
const player2 = "player2"
let currentPlayer = player1

document.querySelector(".attemptsPlayer1").textContent = attempts;
document.querySelector(".scorePlayer1").textContent = score;
document.querySelector(".attemptsPlayer2").textContent = attempts;
document.querySelector(".scorePlayer2").textContent = score;
//document.querySelector(".player").textContent = score;

//extracting the difficulty level and the theme
const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');
const theme = urlParams.get('theme');

if (difficulty) {
    numberCards = parseInt(difficulty);
}

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
        document.querySelector(".player").textContent = currentPlayer + ", it's you're turn!";
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
    document.querySelector(".attemptsPlayer1").textContent = attemptsPlayer1.toString();
    document.querySelector(".attemptsPlayer2").textContent = attemptsPlayer2.toString();
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
        game();
    }, 1000);

}

function scoreIncrement(){
    currentPlayer === player1 ? scorePlayer1++ : scorePlayer2 ++;
    document.querySelector(".scorePlayer1").textContent = scorePlayer1.toString();
    document.querySelector(".scorePlayer2").textContent = scorePlayer2.toString();
    if (scorePlayer1 + scorePlayer2 === numberCards ) { // Check if all matches are found
        clearInterval(timerInterval); // Stop the timer
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
    totalSeconds = 0; // Reset total seconds
    document.querySelector(".scorePlayer1").textContent = scorePlayer1;
    document.querySelector(".attemptsPlayer1").textContent = attemptsPlayer1;
    document.querySelector(".scorePlayer2").textContent = scorePlayer2;
    document.querySelector(".attemptsPlayer2").textContent = attemptsPlayer2;
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
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = padZero(minutes) + ":" + padZero(seconds);
    document.querySelector(".timer").textContent = formattedTime;
}

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

