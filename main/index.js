const gridContainer = document.querySelector(".grid-container"); //reference to grid container
let cards = [];
let cardsAll = [];
let firstCard, secondCard; //cards which are compared
let lockBoard = false; //match
let score = 0;
let attempts = 0;
let numberCards = 5;


document.querySelector(".attempts").textContent = attempts;
document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cardsAll = [...data];
        shuffleCards();
        generateCards();
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
    cards = [...cardsAll.slice(0, numberCards), ...cardsAll.slice(0, numberCards)] //copy every data value -> twice, second argument of slice is number of cards
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
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
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
    attempts++;
    document.querySelector(".attempts").textContent = attempts;
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
    }, 1000);
}

function scoreIncrement(){
    score ++;
    document.querySelector(".score").textContent = score;
}
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}

