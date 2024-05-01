let colored = {
    1: "",
    2: "",
    3: ""
};
const playerNamesForm = document.getElementById('playerNamesForm');
const player1Input = document.getElementById('player1Name');
const player2Input = document.getElementById('player2Name');

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
    if (playerNamesForm.style.display !== 'none' && !playerNamesForm.disabled) {
        if (colored[2] === 'solo' && player1Input.value.trim() !== '') {
            generateGameLink();
        }

        else if (colored[2] === 'two' && player1Input.value.trim() !== '' && player2Input.value.trim() !== '') {
            generateGameLink();
        }

        else {
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
    let theme = colored[1] === "flags" ? "./data/flags.json" : (colored[1] === "cards" ? "./data/fruits.json" : " ./data/nature.json");
    if (colored[1] === "flags") {
        theme = "./data/flags.json";
    }
    if (colored[1] === "fruits") {
        theme = "./data/fruits.json";
    }
    if (colored[1] === "nature") {
        theme = "./data/nature.json";
    }

    if (colored[1] === "random") {
        let random = {
            0: "./data/flags.json",
            1: "./data/fruits.json",
            2: "./data/nature.json"
        };
        let n;
        n = Math.floor(Math.random() * 3);
        console.log(n);
        theme = random[n];
    }
    let difficulty = colored[3] === "easy" ? 4 : (colored[3] === "medium" ? 6 : 9);
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
