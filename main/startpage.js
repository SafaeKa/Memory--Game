let colored = {
    1: "",
    2: "",
    3: ""
};

function changeBackgroundColor(id, value) {
    if (colored[value]) {
        const buttonColored = document.getElementById(colored[value]);
        buttonColored.style.backgroundColor = "white";
    }
    const button = document.getElementById(id);
    button.style.backgroundColor = "green";
    colored[value] = id;
    checkOptionsSelected();
}

function checkOptionsSelected() {
    const startButton = document.getElementById("startButton");
    startButton.disabled = !(colored[1] !== "" && colored[2] !== "" && colored[3] !== "");
}

function generateLink() {
    // Get the player names form and inputs
    const playerNamesForm = document.getElementById('playerNamesForm');
    const player1Input = document.getElementById('player1Name');
    const player2Input = document.getElementById('player2Name');

    // Check if the form is visible and enabled
    if (playerNamesForm.style.display !== 'none' && !playerNamesForm.disabled) {
        // Check if solo player is selected and player 1 name is filled out
        if (colored[2] === 'solo' && player1Input.value.trim() !== '') {
            generateGameLink();
        }
        // Check if two players are selected and both player names are filled out
        else if (colored[2] === 'two' && player1Input.value.trim() !== '' && player2Input.value.trim() !== '') {
            generateGameLink();
        }
        // Display an alert if player names are not entered based on selected player mode
        else {
            if (colored[2] === 'solo') {
                alert('Please enter player 1 name before starting the game');
            } else if (colored[2] === 'two') {
                alert('Please enter both player names before starting the game');
            }
        }
    } else {
        // Display an alert if the form is not visible or disabled
        alert('Please select options and enter player name(s) before starting the game');
    }
}


function generateGameLink() {
    let theme = colored[1] === "flags" ? "./data/flags.json" : (colored[1] === "cards" ? "./data/cards.json" : " ./data/nature.json");
    if (colored[1] === "flags") {
        theme = "./data/flags.json";
    }
    if (colored[1] === "fruits") {
        theme = "./data/cards.json";
    }
    if (colored[1] === "nature") {
        theme = "./data/nature.json";
    }

    if (colored[1] === "random") {
        let random = {
            0: "./data/flags.json",
            1: "./data/cards.json",
            2: "./data/nature.json"
        };
        let n;
        n = Math.floor(Math.random() * 3);
        console.log(n);
        theme = random[n];
    }
    let difficulty = colored[3] === "easy" ? 4 : (colored[3] === "medium" ? 6 : 9);
    let link = `?theme=${theme}&player=${colored[2]}&level=${colored[3]}&difficulty=${difficulty}`;
    window.location.href = "game.html" + link;
}


function togglePlayerInput(playerType) {
    const playerNamesForm = document.getElementById('playerNamesForm');
    const player1Input = document.getElementById('player1Name');
    const player2Input = document.getElementById('player2Name');

    if (playerType === 'solo') {
        player1Input.style.display = 'block';
        player2Input.style.display = 'none';
    } else if (playerType === 'two') {
        player1Input.style.display = 'block';
        player2Input.style.display = 'block';
    }

    playerNamesForm.style.display = 'block';
}
function handlePlayerClick(id, playerType) {
    changeBackgroundColor(id, '2');
    togglePlayerInput(playerType);
}
