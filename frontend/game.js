const gridContainer = document.querySelector(".grid-container"); //reference to grid container
let numberCards = 4; //default number

//extracting the difficulty level and the theme
// Die Übergabe von Daten per URL wäre nicht meine erste Lösungsidee, erfüllt den Zweck aber voll und ganz und macht die Bereitstellung ohne Serverseitigen Code möglich, schön gelöst. 
const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');
const theme = urlParams.get('theme');
const numberPlayers = urlParams.get('player')
// Thema Wiederverwendbarkeit: die extraktion des Namens ist für beide Spieler (abgesehen von den Parameter-Namen) identisch
const player1 = (urlParams.get('player1Name')).charAt(0).toUpperCase() + (urlParams.get('player1Name')).slice(1);
let player2 = 0;
if (numberPlayers === "two") {
    player2 = (urlParams.get('player2Name')).charAt(0).toUpperCase() + (urlParams.get('player2Name')).slice(1);
}
if (difficulty) {
    numberCards = parseInt(difficulty);
}

// Thema Wiederverwendbarkeit: Klarere Datenstrukturen würden hier helfen den Code zu vereinfachen. Bei gleichzeitiger Separation in mehrere Dateien wird alles auch viel übersichtlicher.
// Empfehlung für Klassen: Game, Player, Card, Timer
let cards = [];
let cardsAll = [];
let firstCard, secondCard; //cards which are compared
let lockBoard = false; //match
let scorePlayer1 = 0;
let textScorePlayer1 = "Score " + player1 + ": "; // hierfür wären Methoden zur Generierung der Texte schöner, denkt außerdem an die `${} ...` Syntax für String-Konkatenation
let attemptsPlayer1 = 0;
let textAttemptsPlayer1 = "Attempts " + player1 + ": ";
let scorePlayer2 = 0;
let attemptsPlayer2 = 0;
let textScorePlayer2 = 0;
let textAttemptsPlayer2 = 0;
// gehört bei einem Klassenbasierten Ansatz in eine Initialisirungslogik
if (numberPlayers === "two") {
    textScorePlayer2 = "Score " + player2 + ": ";
    textAttemptsPlayer2 = "Attempts " + player2 + ": ";
}
let timerInterval; // Timer interval ID -> sollte eigentlich Konstant sein
let totalSeconds = 0; // Total seconds elapsed
let currentPlayer = player1 // auch hier wieder das Thema Klassen, ihr nutzt den Namen des spielers hier als Objekt um den gesamten Spieler zu repräsentieren

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

//part responsible for getting the cards
// Der folgende Code ist zwar elegant und präzise, ist aber auch problematisch: ihr ruft einfach blind die theme-URL ab, welche zuvor nicht validiert wird (jeder könnt hier irgendetwas reinschreiben und ihr würdet das abrufen, führt schnell zu Fehlern und potenziell zu Sicherheitslücken)
fetch(theme) 
    .then((res) => res.json())
    .then((data) => {
        cardsAll = [...data];
        shuffleCards();
        generateCards();
        startTimer(); // Start the timer when the game starts
    });


function shuffleCards() {
    // Diese Methode finde ich nicht gelungen. Hier ist nicht nachvollziehbar wie das funktioniert und vor allem nicht warum alles zweimal gemacht wird.

    let currentIndex = cardsAll.length,
        randomIndex,
        temporaryValue; // diese Zeile ist vermutlich nicht so gewollt!
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
        // In den Zeilen darüber ist klar, dass ihr den korrekten Weg kennt, Elemente zu erzeugen. Warum nutzt ihr darunter dan .innerHTML? -> Siehe Best-Practices
        cardElement.innerHTML = `
        <div class="front">
        <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
        if (numberPlayers === "two") {
            // dieser code (ist fast der gleiche wie im else-Zweig -> Methode erstellen!) , außerdem wird er in jedem Schleifendurchlauf ausgeführt, was vermutlich nicht gewollt ist
            document.querySelector(".player").textContent = currentPlayer + ", it's you're turn!";
        }
        else
            document.querySelector(".player").textContent = "Have fun, " + currentPlayer + "!";
        { setTimeout(() => {
            document.querySelector(".player").textContent = ""
        }, 10000);} // Warum ist das ein Block, und warum wird das auch bei jedem Durchlauf gestartet? Damit startet ihr genauso viele Timer mit der gleichen Funktion wie ihr Karten habt

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
    // Die Verwendung von globalen Variablen macht den Code hier schwer verständlich
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    // Nutzt zur Verständlichkeit lieber "normale" if-else Blöcke, das macht euch das Leben leichter, sieht zwar nicht so komplex aus aber das ist gerade das schöne daran.
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

    isMatch ? (disableCards(), scoreIncrement()) : unflipCards(); // siehe meine Bemerkung zu Ternaries oben
}

function disableCards() {
    // Auch hier machen globale Variablen euch das Leben nur schwerer, eine Methode mit zwei Parametern wär deutlich weniger fehleranfällig
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    // Timeout erschließt sich mir nicht ganz, das wäre ein Thema für eure Dokumentation
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
    // Ternaries siehe oben.
    // Auch hier wieder Thematik globale Variablen und bessere Datenstrukturen!
    currentPlayer === player1 ? scorePlayer1++ : scorePlayer2 ++;
    document.querySelector(".scorePlayer1").textContent = textScorePlayer1+ scorePlayer1;
    if (numberPlayers === "two") {
        document.querySelector(".scorePlayer2").textContent = textScorePlayer2 + scorePlayer2;
    }

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
    // wäre eine einfachere Version nicht einfach ein reload der Seite mit window.location.reload() ??
    resetBoard();
    shuffleCards();
    scorePlayer1 = 0;
    attemptsPlayer1 = 0;
    scorePlayer2 = 0;
    attemptsPlayer2 = 0;
    totalSeconds = 0; // Reset total seconds
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

// Das wäre eine perfekte Gelegenheit diese Methoden in eine gemeinsame Klasse auszulagern
// (+ parametrisieren für Selektor des HTML-Elements), dann hättet ihr eine schöne, einfach wiederverwendbare Timer-Komponente
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

