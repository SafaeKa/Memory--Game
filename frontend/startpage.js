let colored = {
    1: "",
    2: "",
    3: ""
};

document.addEventListener('DOMContentLoaded', () => {
    const playerNamesForm = document.getElementById('playerNamesForm');
    const player1Input = document.getElementById('player1Name');
    const player2Input = document.getElementById('player2Name');
    const descriptionText = document.querySelector('.description');

    document.getElementById('flags').addEventListener('click', (event) => changeBackgroundColor(event, '1'));
    document.getElementById('fruits').addEventListener('click', (event) => changeBackgroundColor(event, '1'));
    document.getElementById('nature').addEventListener('click', (event) => changeBackgroundColor(event, '1'));
    document.getElementById('random').addEventListener('click', (event) => changeBackgroundColor(event, '1'));

    document.getElementById('solo').addEventListener('click', () => handlePlayerClick('solo'));
    document.getElementById('two').addEventListener('click', () => handlePlayerClick('two'));

    document.getElementById('easy').addEventListener('click', (event) => changeBackgroundColor(event, '3'));
    document.getElementById('medium').addEventListener('click', (event) => changeBackgroundColor(event, '3'));
    document.getElementById('hard').addEventListener('click', (event) => changeBackgroundColor(event, '3'));

    document.getElementById('startButton').addEventListener('click', generateLink);
});

function changeBackgroundColor(event, value) {
    if (colored[value]) {
        const buttonColored = document.getElementById(colored[value]);
        buttonColored.style.backgroundColor = "white";
    }
    const button = event.target;
    button.style.backgroundColor = "green";
    colored[value] = button.id;
    checkOptionsSelected();
}

function checkOptionsSelected() {
    const startButton = document.getElementById("startButton");
    const playerNamesForm = document.getElementById('playerNamesForm');
    const player1Input = document.getElementById('player1Name');
    const player2Input = document.getElementById('player2Name');
    const descriptionText = document.querySelector('.description');

    let playerNamesFilled = true;

    if (colored[2] === 'solo') {
        playerNamesFilled = player1Input.value.trim() !== '';
    } else if (colored[2] === 'two') {
        playerNamesFilled = player1Input.value.trim() !== '' && player2Input.value.trim() !== '';
    }

    const allOptionsSelected = colored[1] !== "" && colored[2] !== "" && colored[3] !== "";

    if (allOptionsSelected && playerNamesFilled) {
        startButton.style.display = "block";
        descriptionText.classList.add('hidden');
    } else {
        startButton.style.display = "none";
        descriptionText.classList.remove('hidden');
    }
}

function generateLink() {
    const playerNamesForm = document.getElementById('playerNamesForm');
    const player1Input = document.getElementById('player1Name');
    const player2Input = document.getElementById('player2Name');

    if (playerNamesForm.style.display !== 'none' && !playerNamesForm.disabled) {
        if (colored[2] === 'solo' && player1Input.value.trim() !== '') {
            generateGameLink();
        } else if (colored[2] === 'two' && player1Input.value.trim() !== '' && player2Input.value.trim() !== '') {
            generateGameLink();
        } else {
            if (colored[2] === 'solo') {
                alert('Please enter player 1 name before starting the game');
            } else if (colored[2] === 'two') {
                alert('Please enter both player names before starting the game');
            }
        }
    } else {
        alert('Please select options and enter player name(s) before starting the game');
    }
}

function generateGameLink() {
    let theme = "";
    if (colored[1] === "flags") {
        theme = "./data/flags.json";
    } else if (colored[1] === "fruits") {
        theme = "./data/fruits.json";
    } else if (colored[1] === "nature") {
        theme = "./data/nature.json";
    } else if (colored[1] === "random") {
        const random = {
            0: "./data/flags.json",
            1: "./data/fruits.json",
            2: "./data/nature.json"
        };
        const n = Math.floor(Math.random() * 3);
        theme = random[n];
    }

    const difficulty = colored[3] === "easy" ? 4 : (colored[3] === "medium" ? 6 : 9);
    const player1Name = document.getElementById('player1Name').value.trim();
    const player2Name = document.getElementById('player2Name').value.trim();
    let link;
    if (colored[2] === "two") {
        link = `?theme=${theme}&player=two&level=${colored[3]}&difficulty=${difficulty}&player1Name=${player1Name}&player2Name=${player2Name}`;
    } else {
        link = `?theme=${theme}&player=solo&level=${colored[3]}&difficulty=${difficulty}&player1Name=${player1Name}`;
    }
    window.location.href = "game.html" + link;
}

function togglePlayerInput(playerType) {
    const player1Input = document.getElementById('player1Name');
    const player2Input = document.getElementById('player2Name');
    const playerNamesForm = document.getElementById('playerNamesForm');

    if (playerType === 'solo') {
        player1Input.style.display = 'block';
        player2Input.style.display = 'none';
    } else if (playerType === 'two') {
        player1Input.style.display = 'block';
        player2Input.style.display = 'block';
    }
    playerNamesForm.style.display = 'block';
}

function handlePlayerClick(playerType) {
    changeBackgroundColor(event, '2');
    togglePlayerInput(playerType);
}

