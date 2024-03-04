let coloredTheme = "";
let coloredPlayer = "";
let coloredLevel = "";


function changeBackgroundColorTheme(value) {
    if (coloredTheme){
        const buttonColored =  document.getElementById(coloredTheme);
        buttonColored.style.backgroundColor = "white";
    }
    const button = document.getElementById(value);
    button.style.backgroundColor = "green";
    coloredTheme = value;

}
function changeBackgroundColorPlayer(value) {
    if (coloredPlayer){
        const buttonColored =  document.getElementById(coloredPlayer);
        buttonColored.style.backgroundColor = "white";
    }
    const button = document.getElementById(value);
    button.style.backgroundColor = "green";
    coloredPlayer = value;

}
function changeBackgroundColorLevel(value) {
    if (coloredLevel){
        const buttonColored =  document.getElementById(coloredLevel);
        buttonColored.style.backgroundColor = "white";
    }
    const button = document.getElementById(value);
    button.style.backgroundColor = "green";
    coloredLevel = value;

}

