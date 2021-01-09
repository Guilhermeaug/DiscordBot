const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const emoji = require("node-emoji");
require("dotenv").config();
const hltvLeaderBoard = require("./Hltv/hltvLeaderBoard.js");

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Cabeça tá on");
});

function random(message) {
  const number = Math.random(); // generates a random number
  message.channel.send(number.toString()); // sends a message to the channel with the number
}

function leroy(message) {
  message.channel.send("Leeeeerooooyyyyy JEEENNNNKINS"); // sends a message to the channel with the number
}

function lett(message) {
  message.channel.send("<3  " + emoji.get("couplekiss"));
}

function thaix(message) {
  message.channel.send(
    "<3  " + emoji.get("heart") + "  " + emoji.get("couplekiss")
  );
}

function pablo(message) {
  message.channel.send("AIIII QUE DEEELIIICIA CAARRA");
}

function eliza(message) {
  message.channel.send("<3  " + emoji.get("heart"));
}

function kick(message) {
  const user = message.mentions.users.first();
  if (user) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick("Optional reason that will display in the audit logs")
          .then(() => {
            message.reply(`Botei o ${user.tag} para mamar com sucesso!`);
          })
          .catch((err) => {
            message.reply("I was unable to kick the member");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else message.reply("You didn't mention the user to kick!");
  }
}

function randomMessage(message, randomNumber) {
  messages.forEach((item, index) => {
    if (index == randomNumber) {
      console.log("index: " + index + " / item: " + item);
      message.channel.send(item);
    }
  });
}

let commands = new Map();
//Comandos com nomes de pessoas entram aqui
commands.set("random", random);
commands.set("leroy", leroy);
commands.set("lett", lett);
commands.set("thaix", thaix);
commands.set("pablo", pablo);
commands.set("eliza", eliza);

let messages = new Array();
messages.push("Tu é muito estranho");
messages.push("puta");
messages.push("nem te conheço");
messages.push("Para de me chamar");
messages.push("CHATOOO PRA CARAIO");
messages.push("Pensei que você tinha morrido");
messages.push("Não tem mais o que fazer não ?");
messages.push("Vagabundo(a)");
messages.push("Lindo(a)");
messages.push("xuxuzinho");
messages.push("Bacana");
messages.push("Bacanudo");
messages.push("Encapetado");
messages.push("Estressado");
messages.push("Corno");

let queue = new Array();

client.on("message", (message) => {
  if (message.content[0] === "?") {
    const command = message.content.split(" ")[0].substr(1); // gets the command name
    if (commands.has(command)) {
      // checks if the map contains the command
      commands.get(command)(message); // runs the command
    }

    if (message.content.startsWith("?chuteLeroi")) {
      kick(message);
    }
    if (message.content.startsWith("?eu")) {
      let number = Math.round(Math.random() * messages.length);
      console.log("Número aletório gerado para mostrar mensagem: " + number);
      randomMessage(message, number);
    }
    if (message.content.startsWith("?play")) {
      execute(message);
    }
    if (message.content.startsWith("?queue")) {
      showQueue(message);
    }
    if (message.content.startsWith("?teste")) {
      message.channel.send("TESTADO MEU CONSAGRADO");
    }

    if (message.content.startsWith("?hltv")) {
	  //falta terminar
	  hltvLeaderBoard.Ranking(message);
	  
    }
  }
});

async function execute(message) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    console.error("No voice channel found");
    return message.reply("Você não está em um canal de voz, letícia. hehe");
  }

  const connection = await voiceChannel.join();
  const link = message.content.split(" ");
  const musica = link[1];

  if (queue.length != 0) {
    queue.push(musica);
    return message.reply(
      "Sua música entrou na fila, posicao: " + queue.indexOf(musica)
    );
  } else {
    queue.push(musica);
    message.reply("Sua música será executada agora");
    queue.forEach((item, index) => {
      console.warn("música : " + item + " Posicao na fila : " + index);
      const watcher = connection.play(
        ytdl(item, {
          filter: "audioonly",
          quality: "lowest",
        })
      );
      watcher.on("end", () => {
        queue.pop(musica);
      });
    });
  }
}

function showQueue(message) {
  if (!queue || queue.length === 0 || queue == null) {
    message.channel.send("A fila está vazia!");
  }
  queue.forEach((item, index) => {
    message.channel.send(parseInt(index) + 1 + " -  música : " + item);
  });
}

client.login(process.env.DISCORD_TOKEN); // starts the bot up
