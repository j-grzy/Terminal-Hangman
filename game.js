import rls from "readline-sync";
import gradient from "gradient-string";
import chalk from "chalk";
import clear from "console-clear";
import terminalColumns from "terminal-columns";

const user = {
    name: ""
};
const menu = {
    output: [],
    reset(){
        let quit = [chalk.dim(`[${chalk.yellowBright("0")}] quit game`)];
        this.output = [];
        this.output.push(quit);
    },
    display(){
        return this.output.join(" ");
    },
    check(key){
        if (key === "0"){
            process.exit();
        }
    }
};
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
    round : 0,
    rounds: [],
    counter: 0,
    currentW: "",
    hiddenW: "",
    abc: "",
    msg: "",
    reset(){
        this.topic = "";
        this.words = [];
        this.round = 0;
        this.rounds = [];
    },
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
        clear();
        console.log(menu.display());
        console.log(this.title);
        console.log(greeting);
        console.log(`Chose a topic! [${list.join(", ")}]`);
        console.log(topicsStr);
        this.choseTopic(list);
    },
    choseTopic(list){
        let words = [
            ["volleyball", "basketball", "swimming", "handball", "athletics", "football", "hockey", "skating", "golf", "sprint"],
            ["robin","penguin","flamingo","eagle","blackbird","crane","stork","raven","albatross","kingfisher"],
            ["test1","test2","test3"]
        ];
        let topic = rls.keyIn("> ", {limit: [...list, "0"]}).toLowerCase();
        menu.check(topic);
        list.map((listItem, index)=> {
            if (listItem.toLowerCase() === topic){
            this.words = words[index];
            this.topic = this.topics[index];
            }
        });
        this.createRounds();
    },
    createRounds(){
        for (let i = 0; i < this.words.length; i++) {
            this.rounds.push(false);
        }
    },
    resetRound(){
        this.pickRandomWord();
        this.hiddenW = "_".repeat(this.currentW.length);
        this.counter = 0;
        this.abc = "abcdefghijklmnopqrstuvwxyz".split("");
        this.msg = "";
    },
    pickRandomWord(){
        let randomIndex = Math.floor(Math.random() * this.words.length);
        this.currentW = this.words[randomIndex].toLowerCase();
        this.words.splice(randomIndex, 1);
    },
    display(){
        const disTopic = () =>{
            return `TOPIC: ${this.topic}`;
        }
        const disRounds = () => {
            let roundsStr = "ROUND: ";
            for (let i = 0; i < this.rounds.length; i++) {
                if (i < this.round) {
                roundsStr += this.rounds[i] ? chalk.green(`[${i + 1}]`) : chalk.red(`[${i + 1}]`);
                } else if (i === this.round) {
                roundsStr += chalk.whiteBright(`[${i + 1}]`);
                } else {
                roundsStr += chalk.gray(`[${i + 1}]`);
                }
            }
            let l = this.rounds.length * 3 + 9;
            return `${chalk.yellowBright("‾".repeat(l))}\n${roundsStr}\n${chalk.yellowBright("_".repeat(l))}`;
        };
        const disHiddenW = () => {
            let width = 32; // automatisieren?
            let mask = this.hiddenW.toUpperCase().split("").join(" ");
            let spacing = (width - mask.length) / 2;
            let left = spacing % 2 === 0 ? spacing : Math.floor(spacing);
            let right = spacing % 2 === 0 ? spacing : Math.ceil(spacing);
            return (
                chalk.green.dim("╔" + "═".repeat(width) + "╗\n" + "║" + " ".repeat(width) + "║\n" + "║" + " ".repeat(left)) +
                chalk.bold.yellowBright(mask) +
                chalk.green.dim(" ".repeat(right) + "║\n" + "║" + " ".repeat(width) + "║\n" + "╚" + "═".repeat(width) + "╝\n")
            );
        };
        const disABC = () => {
            let abcStr = chalk.green(this.abc.slice(0, 9).join(" - ").toUpperCase() + "\n" + this.abc.slice(9, 18).join(" - ").toUpperCase() + "\n    " + this.abc.slice(18, 25).join(" - ").toUpperCase() + "\n");
            return abcStr;
        };
        const disHangman = () => {
            const hangman = [
                [
                //index 0
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
                [
                //index 1
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █               ___`,
                `    █              /   \\`,
                `    █              \\   /`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
                [
                //index 2
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █               ___`,
                `    █              /   \\`,
                `    █              \\   /`,
                `    █                T`,
                `    █                |`,
                `    █                |`,
                `    █                |`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
                [
                //index 3
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █               ___`,
                `    █              /   \\`,
                `    █              \\   /`,
                `    █                T`,
                `    █               /|`,
                `    █              / |`,
                `    █                |`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
                [
                //index 4
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █               ___`,
                `    █              /   \\`,
                `    █              \\   /`,
                `    █                T`,
                `    █               /|\\`,
                `    █              / | \\`,
                `    █                |`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
                [
                //index 5
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █               ___`,
                `    █              /   \\`,
                `    █              \\   /`,
                `    █                T`,
                `    █               /|\\`,
                `    █              / | \\`,
                `    █                |`,
                `    █               /`,
                `    █              /`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
                [
                //index 6
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █               ___`,
                `    █              /   \\`,
                `    █              \\   /`,
                `    █                T`,
                `    █               /|\\`,
                `    █              / | \\`,
                `    █                |`,
                `    █               / \\`,
                `    █              /   \\`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
                [
                //index 7
                `    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                `    █▛               |`,
                `    █                |`,
                `    █               ___`,
                `    █              /✕ ✕\\`,
                `    █              \\ ~ /`,
                `    █                T`,
                `    █               /|\\`,
                `    █              / | \\`,
                `    █                |`,
                `    █               / \\`,
                `    █              /   \\`,
                `    █`,
                `    █`,
                `    █`,
                `    █`,
                `    █▙`,
                ` ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
                ],
            ];
            return hangman[this.counter].join("\n");
        };
        let table;
        if (this.abc) {
            table = [[disTopic() + "\n\n" + disRounds() + "\n\n\n" + disHiddenW() + "\n" + disABC(), disHangman()]];
        } else if (this.msg){
            table = [[disTopic() + "\n\n"  + disRounds() + "\n\n\n" + disHiddenW() + "\n" + this.msg, disHangman()]];
        } else table = "";
        const output = terminalColumns(table, ["content-width", "content-width"]);

        clear();
        console.log(menu.display());
        console.log(this.title);
        console.log(output);
/*         console.log(disTopic());
        console.log(disRounds());
        console.log(disHiddenW());
        console.log(disABC());
        console.log(disHangman()); */

    },
    checkWord(choice){
        menu.check(choice);
        let index = this.abc.indexOf(choice);
        this.abc.splice(index, 1, " ");
        if (this.currentW.includes(choice)){
            for (let i = 0; i < this.currentW.length; i++) {
                if (choice === this.currentW[i]) {
                    this.hiddenW = this.hiddenW.split("");
                    this.hiddenW.splice(i, 1, choice);
                    this.hiddenW = this.hiddenW.join("");
                }
            }
        } else {
            this.counter++;
        }
    }
}

function welcomeUser(){
    clear();
    menu.reset();
    console.log(menu.display());
    console.log(hangman.title);
    console.log(`Welcome!\nWhat's your name?`);
    let name = rls.question("> ");
    menu.check(name);
    user.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    startGame();
}

function startGame(){
    hangman.reset();
    hangman.displayTopicsMenu();
    function newRound(){
        hangman.resetRound();
        hangman.display();
        while (hangman.hiddenW !== hangman.currentW && hangman.counter < 7) {
            let choice = rls.keyIn("Pick a letter > ", {limit: [...hangman.abc, "0"]});
            hangman.checkWord(choice);
            hangman.display();
        }
        if (hangman.hiddenW === hangman.currentW) {
            hangman.rounds[hangman.round] = true;
            hangman.abc = false;
            if (hangman.round < hangman.rounds.length - 1) {
                hangman.msg = chalk.green("Congrats!\nYou won this round!");
                hangman.display();
                rls.keyInPause("Next round > "); // menu-options??
                hangman.round++;
                newRound();
            } else {
                hangman.msg = chalk.green("Congrats!\nYou won this round.\nGames ends now.");
                hangman.display();
                //press key to see statistics
            }
        }
        if (hangman.counter >= 7) {
            hangman.rounds[hangman.round] = false;
            hangman.abc = false;
            if (hangman.round < hangman.rounds.length - 1) {
                hangman.msg = chalk.red(`You lost this round.\nThe word was ${chalk.white(hangman.currentW.toUpperCase())}.`);
                hangman.display();
                rls.keyInPause("Next round > "); // menu-options??
                hangman.round++;
                newRound();
            } else {
                hangman.msg = chalk.red(`You lost this round.\nThe word was ${chalk.white(hangman.currentW.toUpperCase())}.\nGame ends now.`);
                hangman.display();
                //press key to see statistics
            }
        }
    }
    newRound();
}

welcomeUser();