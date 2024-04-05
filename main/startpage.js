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
    if (colored[1] !== "" && colored[2] !== "" && colored[3] !== "") {
        startButton.disabled = false;
    } else {
        startButton.disabled = true;
    }
}

function generateLink() {
    let link = "?theme=" + colored[1] + "&player=" + colored[2] + "&level=" + colored[3];
    window.location.href = "index.html" + link;
}

