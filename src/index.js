const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const emoji = require("node-emoji");
require("dotenv").config();

const hltvLeaderBoard = require("./Hltv/hltvLeaderBoard.js");

const client = new Discord.Client();

const StringBuilder = require("string-builder");

const puppeteer = require("puppeteer");

client.once("ready", () => {
  console.log("Vou botar para arrombar!");
});


async function searchMusic(message, serverQueue) {
  const args = message.content.split(" ");
  let removed = args.splice(0, 1);
  const keyWords = args.join('+');

  //https://www.youtube.com/results?search_query=aurora+love
  let url = 'https://www.youtube.com/results?search_query='
  url = url.concat(keyWords);

  let scrape = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url);
    const result = await page.evaluate(() => {

      const listaVideos = {
        videos: []
      }

      document.querySelectorAll('h3 > a')
        .forEach(function (video) {

          let musica = {
            title: '',
            url: ''
          }

          musica.title = video.getAttribute('title');
          musica.url = video.getAttribute('href');
          listaVideos.videos.push(musica);
        })

      if (listaVideos.videos.length > 5) {
        while (listaVideos.videos.length > 5) {
          listaVideos.videos.pop();
        }
      }

      return listaVideos;

    })

    browser.close()

    return result;
    
  }

  const listaVideos = await scrape().then((value) => {
    return value;
  });

  const embed = {
    "title": "Escola a música dentre as opções abaixo:",
    "color": 5444442,
    "image": {
      "url": "https://cdn.discordapp.com/avatars/796845658777976903/24dca11d3c97ad3e8e0855f7ef2bbfc0.png"
    },
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/796845658777976903/24dca11d3c97ad3e8e0855f7ef2bbfc0.png",
      "text": "Tenha cuidado!"
    },
    "author": {
      "name": "Sr.Cabeça",
      "url": "https://discordapp.com",
      "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    "fields": [
      {
        "name": `0: ${listaVideos.videos[0].title}`,
        "value": "​\u200b",
        "inline": true
      },
      {
        "name": `1: ${listaVideos.videos[1].title}`,
        "value": "​\u200b",
        "inline": true
      },
      {
        "name": `2: ${listaVideos.videos[2].title}`,
        "value": "​\u200b",
        "inline": true
      },
      {
        "name": `3: ${listaVideos.videos[3].title}`,
        "value": "​\u200b",
        "inline": true
      },
      {
        "name": `4: ${listaVideos.videos[4].title}`,
        "value": "\u200b​",
        "inline": true
      }
    ]
  };

  message.channel.send({embed: embed});

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
      volume: 4,
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

function changeVolume(message, serverQueue) {
  const args = message.content.split(" ");
  const volume = args[1];
  serverQueue.volume = volume;
}


async function teste(message, serverQueue) {
  let recupera = async () => {
    return searchMusic(message, serverQueue);
  }

  const listaVideos = await recupera().then((value) => {
    //console.log(value);
    //execute(message, serverQueue, value);
    return value;
  }).catch(console.error)

  return listaVideos;
}

client.login(process.env.DISCORD_TOKEN); // starts the bot up
