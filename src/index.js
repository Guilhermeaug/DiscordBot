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
	message.channel.send("Leeeeerooooyyyyy JEEEENNNNKINS"); // sends a message to the channel with the number
}

function lett(message) {
	message.channel.send("<3");
}

function thaix(message) {
	message.channel.send("<3");
}

function pablo(message) {
	message.channel.send("AIIII QUE DEEELIIICIA CAARRA");
}

function eliza(message) {
	message.channel.send("<3");
}


let commands = new Map();
commands.set("random", random);
commands.set("leroy", leroy);
commands.set("lett", lett);
commands.set("thaix", thaix);
commands.set("pablo", pablo);
commands.set("eliza", eliza);

client.on("message", message => {
	if (message.content[0] === '?') {
		const command = message.content.split(" ")[0].substr(1); // gets the command name
		if (commands.has(command)) { // checks if the map contains the command
			commands.get(command)(message) // runs the command
		}

		if (message.content.startsWith('?chuteLeroi')) {
			const user = message.mentions.users.first();
			if (user) {
			  const member = message.guild.member(user);
			  if (member) {
				member
				  .kick('Optional reason that will display in the audit logs')
				  .then(() => {
					message.reply(`Botei o ${user.tag} para mamar com sucesso!`);
				  })
				  .catch(err => {
					message.reply('I was unable to kick the member');
					console.error(err);
				  });
			  } else {
				message.reply("That user isn't in this guild!");
			  }
			} else {
			  message.reply("You didn't mention the user to kick!");
			}
		  }
	}
});


client.login('Nzk2ODQ1NjU4Nzc3OTc2OTAz.X_d2WQ.1SX27DFjx7fwHF9uFVTcIkqorLs'); // starts the bot up