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

}