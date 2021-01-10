const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const emoji = require("node-emoji");
require("dotenv").config();
const hltvLeaderBoard = require("./Hltv/hltvLeaderBoard.js");

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

function lucas(message) {
  let id = '359784715634606080';
  message.channel.send(`<@${id}>` + 'Você vai mamar! ');
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
commands.set("lucas", lucas);

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

// let queue = new Array();
const queue = new Map();


client.on("message", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('?')) return;

  const serverQueue = queue.get(message.guild.id);

  const command = message.content.split(" ")[0].substr(1); // gets the command name
  if (commands.has(command)) {
    // checks if the map contains the command
    commands.get(command)(message); // runs the command
  }

  commands.get('lucas')(message);

  if (message.content.startsWith("?chuteLeroi")) {
    kick(message);
  }
  if (message.content.startsWith("?eu")) {
    let number = Math.round(Math.random() * messages.length);
    console.log("Número aletório gerado para mostrar mensagem: " + number);
    randomMessage(message, number);
  }

  if (message.content.startsWith("?play")) {
    execute(message, serverQueue);
  }

  if (message.content.startsWith("?queue")) {
    showQueue(message, serverQueue);
  }

  if (message.content.startsWith("?teste")) {
    message.channel.send("Tô pronto para arrombar! {0} {1}", emoji.get('white_check_mark'), emoji.get('dragon_face'));
  }

  if (message.content.startsWith("?hltv")) {
    hltvLeaderBoard.Ranking(message);
  }

});

async function execute(message, serverQueue) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    console.error("No voice channel found");
    return message.reply("Você não está em um canal de voz, letícia. hehe");
  }

  const args = message.content.split(" ");
  const songInfo = await ytdl.getInfo(args[1]); // a api pega todas as informacoes
  const song = { // separa apenas o necessario
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  };

  if (!serverQueue) {
    const queueBuilder = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueBuilder);

    queueBuilder.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueBuilder.connection = connection;
      play(message.guild.id, queueBuilder.songs[0]);
    } catch (error) {
      console.log(error);
      queue.delete(message.guild.id);
      return message.channel.send(error);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} entrou na fila`);
  }
}

function play(guild, song) {
  const serverQueue = queue.get(guild);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const watcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  watcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function showQueue(message, serverQueue) {

  if (serverQueue) {
    let sb = new StringBuilder();
    serverQueue.songs.forEach(function (item, index) {
      sb.appendFormat("{0}: {1}", index, item.title);
      sb.appendLine();
    });

    message.channel.send(sb.toString());
    sb.append(null);
  }
}

client.login(process.env.DISCORD_TOKEN); // starts the bot up
