let colored = [];


function changeBackgroundColor(id, value ) {
    if (colored[value]){
        const buttonColored =  document.getElementById(colored[value]);
        buttonColored.style.backgroundColor = "white";
    }
    const button = document.getElementById(id);
    button.style.backgroundColor = "green";
    //coloredTheme = id;
    colored[value] = id;
    if (colored[1] !== "" && colored[2] !== "" && colored[3] !== ""){
        generateLink()
    }

}

function generateLink() {
    let link = "?" + "theme=" + colored[1] + "player=" + colored[2] + "level=" + colored[3];
}