let colored = "";
function changeBackgroundColor(value) {
    if (colored){
        const buttonColored =  document.getElementById(colored);
        buttonColored.style.backgroundColor = "white";
    }
    const button = document.getElementById(value);
    button.style.backgroundColor = "green";
    colored = value;

}