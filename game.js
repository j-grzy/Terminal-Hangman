import rls from "readline-sync";
import gradient from "gradient-string";
import chalk from "chalk";
import clear from "console-clear";
import terminalColumns from "terminal-columns";
import Table from "cli-table";

const user = {
    name: "",
    stats: [],
    finalScore : 0,
    resetStats(){
        const h = chalk.hex("#FFA500"); // table head styling
        this.stats = new Table({
            head: [h(" topic "),h("rounds"),h(" won "),h(" lost "),h(" sum "),h("bonus"),h("penalty"),h(" score ")]
        });
        this.finalScore = 0;
    },
    saveStats(rounds){
        const d = chalk.yellowBright; // table data styling
        let topic = hangman.topic;
        let roundCount = rounds.length;
        let won = rounds.filter((item) => item).length;
        let lost = rounds.filter((item)=> !item).length;
        let sum = won*10 - lost*10;
        let bonus = won === roundCount ? 30 : won >= roundCount * 0.8 ? 10 : 0;
        let penalty = lost === roundCount ? -30 : lost >= roundCount * 0.8 ? -10 : 0;
        let score = sum + bonus + penalty;
        this.stats.push([d(topic),d(roundCount),d(won),d(lost),d(sum),d(bonus),d(penalty),d.bold(score)]);
        // lost 100% penalty: -30, lost 80% penalty: 10; won 100% bonus: 30, won 80% bonus 10
        this.finalScore += score;
    },
    displayStats(){
        clear();
        console.log(menu.display());
        console.log(hangman.title);
        console.log(this.stats.toString());
        console.log("\n\n"+chalk.yellowBright(center(`${user.name}'s Final Score: ${this.finalScore}`,64))+"\n");
        console.log("\nPress [" + chalk.yellowBright("0") + "] to quit game or [" + chalk.yellowBright("1") + "] to play again.\n");
        let choice = rls.keyIn("> ", {limit: ["0","1"]});
        menu.check(choice);
    }
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
        if (key === "1"){
            startGame();
        }
    }
};
const titles = {
welcome :  
[
` ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗`,
` ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝`,
` ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  `,
` ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  `,
` ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗`,
`  ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝`
],
to :
[
`                      ████████╗ ██████╗ `,
`                      ╚══██╔══╝██╔═══██╗`,
`                         ██║   ██║   ██║`,
`                         ██║   ██║   ██║`,
`                         ██║   ╚██████╔╝`,
`                         ╚═╝    ╚═════╝ `
],
hm : 
[
`██╗  ██╗ █████╗ ███╗   ██╗ ██████╗ ███╗   ███╗ █████╗ ███╗   ██╗`,
`██║  ██║██╔══██╗████╗  ██║██╔════╝ ████╗ ████║██╔══██╗████╗  ██║`,
`███████║███████║██╔██╗ ██║██║  ███╗██╔████╔██║███████║██╔██╗ ██║`,
`██╔══██║██╔══██║██║╚██╗██║██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║`,
`██║  ██║██║  ██║██║ ╚████║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║`,
`╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝`
],
hangman: function(){ return gradient("yellow", "orange", "yellow", "orange", "yellow").multiline(`\n${this.hm.join("\n")}\n`)}
}
const hangman = {
    title: titles.hangman(),
    topics: ["sports", "birds", "food"],
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
    displayLogin(){
        let msg = [
center(`╔════════════════════════════════════════════════════╗`,64),
center(`║                                                    ║`,64),
center(`║   ┬ ┬┬ ┬┌─┐┌┬┐┌─┐  ┬ ┬┌─┐┬ ┬┬─┐  ┌┐┌┌─┐┌┬┐┌─┐┌─┐   ║`,64),
center(`║   │││├─┤├─┤ │ └─┐  └┬┘│ ││ │├┬┘  │││├─┤│││├┤  ┌┘   ║`,64),
center(`║   └┴┘┴ ┴┴ ┴ ┴ └─┘   ┴ └─┘└─┘┴└─  ┘└┘┴ ┴┴ ┴└─┘ o    ║`,64),
center(`║                                                    ║`,64),
center(`╚════════════════════════════════════════════════════╝`,64)
];
        clear();
        console.log(menu.display());
        console.log(hangman.title);
        console.log("\n"+chalk.hex("#FFA500")(msg.join("\n"))+"\n\n");
        let name = rls.question("> ");
        menu.check(name);
        user.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    },
    displayInstr(){
        let greeting = chalk.yellowBright(center(`Hello ${user.name}!`,64))+"\n";
        let ins = [
center(`        ╦┌┐┌┌─┐┌┬┐┬─┐┬ ┬┌─┐┌┬┐┬┌─┐┌┐┌┌─┐      `,64),
center(`╔══════ ║│││└─┐ │ ├┬┘│ ││   │ ││ ││││└─┐ ════╗`,64),
center(`║       ╩┘└┘└─┘ ┴ ┴└─└─┘└─┘ ┴ ┴└─┘┘└┘└─┘     ║`,64),
center(`║                                            ║`,64),
center(`║    1.) Tho goal is to guess the word       ║`,64),
center(`║        and save the man!                   ║`,64),
center(`║                                            ║`,64),
center(`║    2.) You can guess only one letter       ║`,64),
center(`║        at a time.                          ║`,64),
center(`║                                            ║`,64),
center(`║    3.) If you make 7 wrong guesses the     ║`,64),
center(`║        man will die.                       ║`,64),
center(`║                                            ║`,64),
center(`║    4.) You will get a bonus or a penalty   ║`,64),
center(`║        depending on how many times you     ║`,64),
center(`║        rescued him or let him die.         ║`,64),
center(`║                                            ║`,64),
center(`╚════════════════════════════════════════════╝`,64)
];
        clear();
        console.log(menu.display());
        console.log(hangman.title);
        console.log(greeting);
        console.log(chalk.hex("#FFA500")(ins.join("\n"))+"\n");
        rls.keyInPause("Start game > "); 
    },
    displayTopicsMenu(){
        let heading = 
[
center(`┌┬┐┌─┐┌─┐┬┌─┐┌─┐`,64),
center(` │ │ │├─┘││  └─┐`,64),
center(` ┴ └─┘┴  ┴└─┘└─┘`,64)
];
        let topicsStr = "";
        let listCount = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        let list = [];
        let boxWidth = 40;
        let lwl = this.topics.reduce((acc,str) => acc.length > str.length ? acc : str).length; // length of longest word in list
        let l = Math.floor((boxWidth-lwl-4)/2);
        let paddingLeft = " ".repeat(l);
        topicsStr = center(`╔${"══".repeat(boxWidth/2)}╗`,64) + "\n" + center(`║${" ".repeat(boxWidth)}║`,64) + "\n";
        this.topics.map((topic, index)=>{
            list.push(listCount[index]);
            let r = boxWidth-topic.length-4-l;
            let paddingRight = " ".repeat(r);
            topicsStr += center(`║${paddingLeft}[${listCount[index]}] ${topic}${paddingRight}║`,64)+ "\n" + center(`║${" ".repeat(boxWidth)}║`,64)+ "\n";
        });
        topicsStr += center(`╚${"══".repeat(boxWidth/2)}╝`,64);
        let message = chalk.yellowBright(center(`Chose a topic, ${user.name}! [${list.join(", ")}]`,64)) + "\n"; 
        clear();
        console.log(menu.display());
        console.log(this.title);
        console.log(message);
        console.log(chalk.hex("#FFA500")(heading.join("\n")));
        console.log(chalk.hex("#FFA500")(topicsStr));
        this.choseTopic(list);
    },
    choseTopic(list){
        let words = [
            ["volleyball", "basketball", "swimming", "handball", "athletics", "football", "hockey", "skating", "golf", "tennis"],
            ["robin","penguin","flamingo","eagle","blackbird","crane","stork","raven","albatross","kingfisher"],
            ["pancakes","sushi","cookie","bread","sandwich","cheesecake","falafel","burger","pasta","salad"]
            //["test","test","test"]
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
            return chalk.hex("#FFA500")("TOPIC: ") + chalk.yellowBright(this.topic);
        }
        const disRounds = () => {
            let roundsStr = chalk.hex("#FFA500")("ROUND: ");
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
            let width = 32; 
            let mask = this.hiddenW.toUpperCase().split("").join(" ");
            let spacing = (width - mask.length) / 2;
            let left = spacing % 2 === 0 ? spacing : Math.floor(spacing);
            let right = spacing % 2 === 0 ? spacing : Math.ceil(spacing);
            return (
                chalk.green.dim("  ╔" + "═".repeat(width) + "╗\n" + "  ║" + " ".repeat(width) + "║\n" + "  ║" + " ".repeat(left)) +
                chalk.bold.yellowBright(mask) +
                chalk.green.dim(" ".repeat(right) + "║\n" + "  ║" + " ".repeat(width) + "║\n" + "  ╚" + "═".repeat(width) + "╝\n")
            );
        };
        const disABC = () => {
            let abcStr = "  " + chalk.green(this.abc.slice(0, 9).join(" - ").toUpperCase() + "\n" + "  " + this.abc.slice(9, 18).join(" - ").toUpperCase() + "\n      " + this.abc.slice(18, 25).join(" - ").toUpperCase() + "\n");
            return abcStr;
        };
        const disHangman = () => {
            const hangman = [
                [
                    //index 0
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`)].join(""),
                    chalk.hex("#993300")`   ▐█  ▟█▛`,
                    chalk.hex("#993300")`   ▐█▟█▛`,
                    chalk.hex("#993300")`   ▐█▛`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
                ],
                [
                    //index 1
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`),chalk.bold.yellowBright(`__`)].join(""),
                    [chalk.hex("#993300")`   ▐█  ▟█▛          `,chalk.bold.yellowBright(`╱ ⸲⸲╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█▟█▛            `,chalk.bold.yellowBright(`╲ ⹇ ╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█▛              `,chalk.yellowBright(`⌠▔▔▔ `)].join(""),
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
                ],
                [
                    //index 2
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`),chalk.bold.yellowBright(`__`)].join(""),
                    [chalk.hex("#993300")`   ▐█  ▟█▛          `,chalk.bold.yellowBright(`╱ ⸲⸲╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█▟█▛            `,chalk.bold.yellowBright(`╲ ⹇ ╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█▛              `,chalk.yellowBright(`⌠▔▔▔ `)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(` │`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`  │`)].join(""),
                    [chalk.hex("#993300")`   ▐█               `,chalk.yellowBright(`│`)].join(""),
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
                ],
                [
                    //index 3
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`),chalk.bold.yellowBright(`__`)].join(""),
                    [chalk.hex("#993300")`   ▐█  ▟█▛          `,chalk.bold.yellowBright(`╱ ⸲⸲╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█▟█▛            `,chalk.bold.yellowBright(`╲ ⹇ ╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█▛              `,chalk.yellowBright(`⌠▔▔▔ `)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱│`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱ │`)].join(""),
                    [chalk.hex("#993300")`   ▐█               `,chalk.yellowBright(`│`)].join(""),
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
                ],
                [
                    //index 4
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`),chalk.bold.yellowBright(`__`)].join(""),
                    [chalk.hex("#993300")`   ▐█  ▟█▛          `,chalk.bold.yellowBright(`╱ ⸲⸲╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█▟█▛            `,chalk.bold.yellowBright(`╲ ⹇ ╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█▛              `,chalk.yellowBright(`⌠▔▔▔ `)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱│╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱ │ ╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█               `,chalk.yellowBright(`│`)].join(""),
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
                ],
                [
                    //index 5
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`),chalk.bold.yellowBright(`__`)].join(""),
                    [chalk.hex("#993300")`   ▐█  ▟█▛          `,chalk.bold.yellowBright(`╱ ⸲⸲╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█▟█▛            `,chalk.bold.yellowBright(`╲ ⹇ ╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█▛              `,chalk.yellowBright(`⌠▔▔▔ `)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱│╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱ │ ╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█               `,chalk.yellowBright(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱`)].join(""),
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
                ],
                [
                    //index 6
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`),chalk.bold.yellowBright(`__`)].join(""),
                    [chalk.hex("#993300")`   ▐█  ▟█▛          `,chalk.bold.yellowBright(`╱ ⸲⸲╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█▟█▛            `,chalk.bold.yellowBright(`╲ ⹇ ╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█▛              `,chalk.yellowBright(`⌠▔▔▔ `)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱│╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱ │ ╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█               `,chalk.yellowBright(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱ ╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱   ╲`)].join(""),
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
                ],
                [
                    //index 7
                    chalk.hex("#993300")`   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`,
                    [chalk.hex("#993300")`   ▐█▛       ▟█▛     `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█      ▟█▛       `,chalk.white.bold(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█    ▟█▛         `,chalk.white(`⌡`),chalk.bold.yellowBright(`__`)].join(""),
                    [chalk.hex("#993300")`   ▐█  ▟█▛          `,chalk.bold.yellowBright(`╱ ₓₓ╲`)].join(""), 
                    [chalk.hex("#993300")`   ▐█▟█▛            `,chalk.bold.yellowBright(`╲ ~ ╱`)].join(""),
                    [chalk.hex("#993300")`   ▐█▛              `,chalk.yellowBright(`⌠▔▔▔ `)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱│╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱ │ ╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█               `,chalk.yellowBright(`│`)].join(""),
                    [chalk.hex("#993300")`   ▐█              `,chalk.yellowBright(`╱ ╲`)].join(""),
                    [chalk.hex("#993300")`   ▐█             `,chalk.yellowBright(`╱   ╲`)].join(""),
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`   ▐█`,
                    chalk.hex("#993300")`  ▟▉█▙`,
                    chalk.hex("#006600")(` ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`),
                    chalk.hex("#006600")(`  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒`),
                    chalk.hex("#006600")(`   ░░░░░░░░░░░░░░░░░░░░░░░`)
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

function start(){
    let arr = [];
    for (let i = 0; i <= 30; i++) arr.push(" ");
    let arr2 = [];
    let arr3 = [];
    let counter = 0;
    let counter2 = 0;
    let counter3 = 0;
    let text = [];
    let text2 = [];
    let text3 = [];
    let color = gradient("orange", "yellow", "orange").multiline;
    
    function welcomeAnimation(){
        let welcome = titles.welcome;
        let to = titles.to;
        let hm = titles.hm;
        if (arr.length > 0){
            let item = arr.splice(0,1);
            if (counter < welcome.length){
                text.push(welcome[counter]);
                counter++;
            }else {
            arr2.push(item);
            }
            clear();
            console.log(arr.join("\n"));
            console.log(color(text.join("\n")));
            console.log(arr2.join("\n"));
        } else {
            clearInterval(int);
            function toAnimation(){
                if (arr2.length > 0){
                    let item = arr2.splice(0,1);
                    if (counter2 < to.length){
                        text2.push(to[counter2]);
                        counter2++;
                    } else {
                    arr3.push(item);
                    }
                    clear();
                    console.log(arr.join("\n"));
                    console.log(color(text.join("\n")));
                    console.log(arr2.join("\n"));
                    console.log(color(text2.join("\n")));
                    console.log(arr3.join("\n"));
                } else {
                    clearInterval(int2);
                    function hmAnimation(){
                        if (arr3.length > 0){
                            arr3.splice(0,1);
                            if (counter3 < hm.length){
                                text3.push(hm[counter3]);
                                counter3++;
                            }
                            clear();
                            console.log(arr.join("\n"));
                            console.log(color(text.join("\n")));
                            console.log(arr2.join("\n"));
                            console.log(color(text2.join("\n")));
                            console.log(arr3.join("\n"));
                            console.log(color(text3.join("\n")));
                        } else {
                            clearInterval(int3);
                            const timeout = setTimeout(welcomeUser, 1500);
                        }
                    }
                    const int3 = setInterval(hmAnimation, 40);
                }
            }
            const int2 = setInterval(toAnimation, 40);
        }
    }
    const int = setInterval(welcomeAnimation, 40);
    
}

function welcomeUser(){
    clear();
    menu.reset();
    user.resetStats();
    hangman.displayLogin();
    hangman.displayInstr();
    startGame();
}

function startGame(){
    hangman.reset();
    menu.reset();
    hangman.displayTopicsMenu();
    function newRound(){
        menu.reset();
        menu.output.push([chalk.dim(`[${chalk.yellowBright("1")}] restart game`)]);
        hangman.resetRound();
        hangman.display();
        while (hangman.hiddenW !== hangman.currentW && hangman.counter < 7) {
            let choice = rls.keyIn("Pick a letter > ", {limit: [...hangman.abc, "0","1"]});
            hangman.checkWord(choice);
            hangman.display();
        }
        if (hangman.hiddenW === hangman.currentW) {
            hangman.rounds[hangman.round] = true;
            hangman.abc = false;
            if (hangman.round < hangman.rounds.length - 1) {
                hangman.msg = chalk.greenBright("Congrats!\nYou won this round!");
                hangman.display();
                rls.keyInPause("Next round > "); // menu-options??
                hangman.round++;
                newRound();
            } else {
                hangman.msg = chalk.greenBright("Congrats!\nYou won this round.\nGames ends now.\n\n")+ chalk.white("Press key to see your stats.\n");
                hangman.display();
                rls.keyInPause("> "); // menu-options??
                user.saveStats(hangman.rounds);
                user.displayStats();
            }
        }
        if (hangman.counter >= 7) {
            hangman.rounds[hangman.round] = false;
            hangman.abc = false;
            if (hangman.round < hangman.rounds.length - 1) {
                hangman.msg = chalk.redBright(`You lost this round.\nThe word was ${chalk.white(hangman.currentW.toUpperCase())}.`);
                hangman.display();
                rls.keyInPause("Next round > "); // menu-options??
                hangman.round++;
                newRound();
            } else {
                hangman.msg = chalk.redBright(`You lost this round.\nThe word was ${chalk.white(hangman.currentW.toUpperCase())}.\nGame ends now.\n\n`) +  chalk.white("Press key to see your stats.\n");
                hangman.display();
                rls.keyInPause("> "); // menu-options??
                user.saveStats(hangman.rounds);
                user.displayStats();
            }
        }
    }
    newRound();
}

start();


function center(str, width){
    let margin = str.length < width ? " ".repeat(Math.floor((width-str.length) / 2)) : "";
    return `${margin}${str}`;
}