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
    let difficulty = colored[3] === "easy" ? 4 : (colored[3] === "medium" ? 6 : 9);
    let link = `?theme=${colored[1]}&player=${colored[2]}&level=${colored[3]}&difficulty=${difficulty}`;
    window.location.href = "index.html" + link;

}

