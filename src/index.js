const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const emoji = require("node-emoji");
require("dotenv").config();
const { google } = require('googleapis');
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_TOKEN
})

const hltvLeaderBoard = require("./Hltv/hltvLeaderBoard.js");

const client = new Discord.Client();

const StringBuilder = require("string-builder");

client.once("ready", () => {
  console.log("Vou botar para arrombar!");
});

async function searchByKeyword(message, serverQueue) {
  const args = message.content.split(" ");
  let removed = args.splice(0, 1);
  //const keyWords = args.join('+')
  const query = args.join(' ');

  let request = async () => {
    var results = youtube.search.list({
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: 10
    }).catch(console.error);

    return results;
  }

  const listaVideos = await request().then(results => {
    const listaVideos = { videos: [] }
    const listItems = results.data.items;
    listItems.forEach(item => {
      var musica = { url: '', title: '' }

      const videoId = item.id.videoId;
      const videoTitle = item.snippet.title;

      musica.url = `https://www.youtube.com/watch?v=${videoId}`;
      musica.title = videoTitle;

      listaVideos.videos.push(musica);
    });

    return listaVideos;

  });

  const embed = new Discord.MessageEmbed()
    .setColor(5444442)
    .setTitle('Escola a música dentre as opções abaixo:')
    .setImage('https://cdn.discordapp.com/avatars/796845658777976903/24dca11d3c97ad3e8e0855f7ef2bbfc0.png')
    .setFooter('Tenha cuidado!', 'https://64.media.tumblr.com/b91d7d1bf5b90c1856393b9a0bca6f03/54f93eb2c4a807f3-10/s250x400/de82b02d86ce6e08b2d0ecd578c055bbb8f64d2c.png')
    .addFields(
      { name: `${emoji.get('zero')}: ${listaVideos.videos[0].title}`, value: '\u200b' },
      { name: `${emoji.get('one')}: ${listaVideos.videos[1].title}`, value: '\u200b' },
      { name: `${emoji.get('two')}: ${listaVideos.videos[2].title}`, value: '\u200b' },
      { name: `${emoji.get('three')}: ${listaVideos.videos[3].title}`, value: '\u200b' },
      { name: `${emoji.get('four')}: ${listaVideos.videos[4].title}`, value: '\u200b' },
      { name: `${emoji.get('five')}: ${listaVideos.videos[5].title}`, value: '\u200b' },
      { name: `${emoji.get('six')}: ${listaVideos.videos[6].title}`, value: '\u200b' },
      { name: `${emoji.get('seven')}: ${listaVideos.videos[7].title}`, value: '\u200b' },
      { name: `${emoji.get('eight')}: ${listaVideos.videos[8].title}`, value: '\u200b' },
      { name: `${emoji.get('nine')}: ${listaVideos.videos[9].title}`, value: '\u200b' })
    .setTimestamp();

  message.channel.send(embed);

  return listaVideos;

}

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

// let queue = new Array();
const queue = new Map();
var listaVideos;
var mensagem = new Discord.Message();


client.on("message", (message) => {
  if (message.author.bot) return;
  //if (!message.content.startsWith('?')) return;

  const serverQueue = queue.get(message.guild.id);

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
    execute(message, serverQueue, null);
  }

  if (message.content.startsWith("?queue")) {
    showQueue(message, serverQueue);
  }

  if (message.content.startsWith("?clean")) {
    cleanQueue(message, serverQueue);
  }

  if (message.content.startsWith("?skip")) {
    skipQueue(message, serverQueue);
  }

  if (message.content.startsWith("?volume")) {
    changeVolume(message, serverQueue);
  }

  if (message.content.startsWith("?search")) {
    mensagem = message;
    arromba(message, serverQueue);
  }

  if (message.content.startsWith("?clear")) {
    clearQueue(message, serverQueue);
  }

  if (!message.content.startsWith("?") && mensagem.content != '') {
    if (message.author === mensagem.author) {
      execute(message, serverQueue, listaVideos);
    }
  }

  if (message.content.startsWith("?teste")) {
    message.channel.send("Tô pronto para arrombar! {0} {1}", emoji.get('white_check_mark'), emoji.get('dragon_face'));
  }

  if (message.content.startsWith("?hltv")) {
    hltvLeaderBoard.Ranking(message);
  }

});

async function arromba(message, serverQueue) {
  listaVideos = await teste(message, serverQueue);
}

async function execute(message, serverQueue, listaVideos) {
  mensagem.content = '';
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    console.error("No voice channel found");
    return message.reply("Você não está em um canal de voz, letícia. hehe");
  }

  const song = { // separa apenas o necessario
    title: '',
    url: ''
  };

  if (listaVideos) {
    const url = 'youtube.com'.concat(listaVideos.videos[message.content].url);
    const songInfo = await ytdl.getInfo(url);
    song.title = songInfo.videoDetails.title;
    song.url = songInfo.videoDetails.video_url;
  } else {
    const args = message.content.split(" ");
    const songInfo = await ytdl.getInfo(args[1]); // a api pega todas as informacoes
    song.title = songInfo.videoDetails.title;
    song.url = songInfo.videoDetails.video_url;
  }

  if (!serverQueue) {
    const queueBuilder = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 2,
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
    queue.delete(guild);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
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

function cleanQueue(message, serverQueue) {
  if (serverQueue) {
    serverQueue.songs = [];
  }
}

function skipQueue(message, serverQueue) {
  if (!serverQueue)
    return message.channel.send("Larga a mão de ser mula!");

  serverQueue.connection.dispatcher.end();
}

function clearQueue(message, serverQueue) {
  if (!serverQueue)
    return message.channel.send('Larga a mão de ser mula!');

  serverQueue.voiceChannel.leave();
  queue.delete(message.guild.id);

}

function changeVolume(message, serverQueue) {
  const args = message.content.split(" ");
  const volume = args[1];
  serverQueue.volume = volume;
}

async function teste(message, serverQueue) {
  let recupera = async () => {
    return searchByKeyword(message, serverQueue);
  }

  const listaVideos = await recupera().then((value) => {
    return value;
  }).catch(console.error)

  return listaVideos;
}


client.login(process.env.DISCORD_TOKEN); // starts the bot up
