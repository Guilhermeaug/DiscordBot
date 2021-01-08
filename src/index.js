const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library
const dotenv = require("dotenv");

const client = new Discord.Client(); // creates a discord client
//const token = fs.readFileSync("token.txt").toString(); // gets your token from the file
const envConfig = dotenv.config();

client.once("ready", () => { // prints "Ready!" to the console once the bot is online
	console.log("Ready!");
});

function random(message) {
    const number = Math.random(); // generates a random number
    message.channel.send(number.toString()); // sends a message to the channel with the number
}

function leroy(message) {
    message.channel.send("Leeeeerooooyyyyy JEEENNNNKINS"); // sends a message to the channel with the number
}

let commands = new Map();
commands.set("random", random);
commands.set("leroy", leroy);

client.on("message", message => {
    if (message.content[0] === '?') {
        const command = message.content.split(" ")[0].substr(1); // gets the command name
        if (commands.has(command)) { // checks if the map contains the command
            commands.get(command)(message) // runs the command
		}
		if(commands.has(command)){
			commands.get(command)(message)
		}
    }
});


client.login('Nzk2ODQ1NjU4Nzc3OTc2OTAz.X_d2WQ.1SX27DFjx7fwHF9uFVTcIkqorLs'); // starts the bot up