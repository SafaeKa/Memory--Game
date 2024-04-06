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
    let theme = colored[1] === "flags" ? "./data/flags.json" : "./data/cards.json";
    let difficulty = colored[3] === "easy" ? 4 : (colored[3] === "medium" ? 6 : 9);
    let link = `?theme=${theme}&player=${colored[2]}&level=${colored[3]}&difficulty=${difficulty}`;
    window.location.href = "index.html" + link;
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
