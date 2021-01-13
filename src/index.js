const Discord = require("discord.js");
const emoji = require("node-emoji");
require("dotenv").config();

const hltvLeaderBoard = require("./Hltv/hltvLeaderBoard.js");
const music = require("./Music/music.js")

const client = new Discord.Client();

const StringBuilder = require("string-builder");

client.once("ready", () => {
  console.log("Vou botar para arrombar!");
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


var mensagem = new Discord.Message();


client.on("message", (message) => {
  if (message.author.bot) return;
  //if (!message.content.startsWith('?')) return;

  const serverQueue = music.queue.get(message.guild.id);

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
    //execute(message, serverQueue, null);
    music.Execute(message, serverQueue, null);
  }

  if (message.content.startsWith("?queue")) {
    music.ShowQueue(message, serverQueue);
  }

  if (message.content.startsWith("?clean")) {
    music.CleanQueue(message, serverQueue);
  }

  if (message.content.startsWith("?skip")) {
    music.SkipQueue(message, serverQueue);
  }

  if (message.content.startsWith("?volume")) {
    music.ChangeVolume(message, serverQueue);
  }

  if (message.content.startsWith("?search")) {
    mensagem = message;
    //arromba(message, serverQueue);
    music.Arromba(message, serverQueue);
  }

  if (message.content.startsWith("?clear")) {
    music.ClearQueue(message, serverQueue);
  }

  if (!message.content.startsWith("?") && mensagem.content != '') {
    if (message.author === mensagem.author) {
      music.Execute(message, serverQueue, music.listaVideos);
      mensagem.content = '';
    }
  }

  if (message.content.startsWith("?teste")) {
    message.channel.send(`Tô pronto para arrombar! {0} {1}`, emoji.get('white_check_mark'), emoji.get('dragon_face'));
  }

  if (message.content.startsWith("?hltv")) {
    hltvLeaderBoard.Ranking(message);
  }

});


client.login(process.env.DISCORD_TOKEN); // starts the bot up
