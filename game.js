import rls from "readline-sync";
import gradient from "gradient-string";
import chalk from "chalk";

const user = {
    name: ""
};
const menu = [""];
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
    title: titles.hangman,
    topics: ["sports", "birds", "something"],
    topic: "",
    words: [],
    displayTopicsMenu(){
        let greeting = `Hello ${user.name}!`
        let topicsStr = "";
        let listCount = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        let list = [];
        let boxWidth = 50;
        let lwl = this.topics.reduce((acc,str) => acc.length > str.length ? acc : str).length; // length of longest word in list
        let l = Math.floor((boxWidth-lwl-4)/2);
        let paddingLeft = " ".repeat(l);
        topicsStr = `╔${"══".repeat(boxWidth/2)}╗\n║${" ".repeat(boxWidth)}║\n`;
        this.topics.map((topic, index)=>{
            list.push(listCount[index]);
            let r = boxWidth-topic.length-4-l;
            let paddingRight = " ".repeat(r)
            topicsStr += `║${paddingLeft}[${chalk.bold.yellowBright(listCount[index])}] ${chalk.white(topic)}${paddingRight}║\n║${" ".repeat(boxWidth)}║\n`;
        });
        topicsStr += `╚${"══".repeat(boxWidth/2)}╝`;
        //console.log(menu);
        console.log(this.title);
        console.log(greeting);
        console.log(`Chose a topic! [${list.join(", ")}]`);
        console.log(topicsStr);
    },
    choseTopic(){
        this.displayTopicsMenu();
        let words = [
            ["volleyball", "basketball", "swimming", "handball", "athletics", "football", "hockey", "skating", "golf", "sprint"],
            ["robin","penguin","flamingo","eagle","blackbird","crane","stork","raven","albatross","kingfisher"],
            ["test1","test2","test3"]
        ]
    }
}

function welcomeUser(){
    //console.log(menu);
    console.log(hangman.title);
    console.log(`Welcome!\nWhat's your name?`);
    let name = rls.question("> ");
    user.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    startGame();
}

function startGame(){
    hangman.choseTopic();
    function newRound(){
    }
}

welcomeUser();