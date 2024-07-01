import rls from "readline-sync";
import gradient from "gradient-string";

const user = {
    name: ""
};
const menu = [];
const titles = {
    hangman: gradient("yellow", "orange", "yellow", "orange", "yellow").multiline(
`
██╗  ██╗ █████╗ ███╗   ██╗ ██████╗ ███╗   ███╗ █████╗ ███╗   ██╗
██║  ██║██╔══██╗████╗  ██║██╔════╝ ████╗ ████║██╔══██╗████╗  ██║
███████║███████║██╔██╗ ██║██║  ███╗██╔████╔██║███████║██╔██╗ ██║
██╔══██║██╔══██║██║╚██╗██║██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║
██║  ██║██║  ██║██║ ╚████║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`)
}
const hangman = {
    title: titles.hangman
}

function welcomeUser(){
    console.log(`Welcome!\nWhat's your name?`);
    let name = rls.question("> ");
    user.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    console.log("Hello", user.name);
    startGame();
}

function startGame(){
    function newRound(){
    }
}

welcomeUser();