import Discord from "discord.js";
import pkg from "googleapis";
import ytdl from "discord-ytdl-core";
import emoji from "node-emoji";
import dotenv from "dotenv";

//import leroy from '../leroy'; --> amuleto da sorte --> que Deus nos abençoe

dotenv.config();

const { google } = pkg;
const youtube = google.youtube({
  version: "v3",
  auth: process.env.GOOGLE_TOKEN,
});

const songQueue = [];
let videosListFromApi = [];

let isPlaying = false;

export const addMusicRequest = async (message, choosenUrl) => {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você não está em um canal de voz, Leticia, Hehehehe"
    );

  const youtubeUrl = choosenUrl
    ? choosenUrl
    : message.content.split(" ")[1].substr(0);

  if (ytdl.validateURL(youtubeUrl)) {
    if (youtubeUrl.includes("list")) {
      getVideosFromPlaylistUrl(message, youtubeUrl);
    } else {
      const musicInfo = await ytdl.getInfo(youtubeUrl);
      const musicTitle = musicInfo.videoDetails.title;
      const musicLength = musicInfo.videoDetails.lengthSeconds;
      
      songQueue.push({
        title: musicTitle,
        url: youtubeUrl,
        lenght: musicLength,
      });

      if (!isPlaying) {
        isPlaying = true;
        playSong(message, songQueue.shift());
      }
    }
  } else {
    return message.channel.send("Insira uma URL válida corno");
  }
};

const getVideosFromPlaylistUrl = async (message, youtubeUrl) => {
  const playlistId = youtubeUrl.split("=")[2];

  const request = async () => {
    let results = youtube.playlistItems
      .list({
        part: "contentDetails",
        playlistId: playlistId,
        maxResults: 50,
      })
      .catch(console.error);
    return results;
  };

  const videos = await request();

  const arrayUrlVideos =  videos.data.items.map((el) => {
    const url = `https://www.youtube.com/watch?v=${el.contentDetails.videoId}`;
    return url;
  });

  for(let i = 0; i < arrayUrlVideos.length; i++){
    await addMusicRequest(message, arrayUrlVideos[i]);
  }
};

export const playSong = (message, currentSong) => {
  currentSong
    ? console.log("Música atual: ", currentSong)
    : "Sem músicas no momento";

  if (currentSong) {
    isPlaying = true;
    message.channel.send(`A rádio Sr.Cabeça apresenta ${currentSong.title}`);

    const stream = ytdl(currentSong.url, {
      filter: "audioonly",
      opusEncoded: false,
      fmt: "mp3",
      encoderArgs: ["-af", "bass=g=10,dynaudnorm=f=200"],
    });

    message.member.voice.channel.join().then((connection) => {
      let dispatcher = connection
        .play(stream, {
          type: "unknown",
        })
        .on("finish", () => {
          playSong(message, songQueue.shift());
        })
        .on("error", (error) => console.error(error));
    });
  } else {
    isPlaying = false;
    message.guild.me.voice.channel.leave();
  }
};

export const skipSong = (message) => {
  if (!message.member.voice.channel) {
    return message.channel.send(
      "Você não está em um canal de voz, Leticia, Hehehehe"
    );
  }
  if (!isPlaying) {
    return message.channel.send("Não tem música na fila jumento quadrado");
  } else {
    playSong(message, songQueue.shift());
  }
};

export const searchByKeyword = async (message) => {
  const args = message.content.split(" ");
  let removed = args.splice(0, 1);
  const query = args.join(" ");

  let request = async () => {
    var results = youtube.search
      .list({
        q: query,
        part: "snippet",
        type: "video",
        maxResults: 10,
      })
      .catch(console.error);

    return results;
  };

  const listaVideos = await request().then((results) => {
    const listaVideos = [];
    const listItems = results.data.items;

    listItems.forEach((item) => {
      var musica = { url: "", title: "" };

      const videoId = item.id.videoId;
      const videoTitle = item.snippet.title;

      musica.url = `https://www.youtube.com/watch?v=${videoId}`;
      musica.title = videoTitle;

      listaVideos.push(musica);
    });

    return listaVideos;
  });

  const embed = new Discord.MessageEmbed()
    .setColor(5444442)
    .setTitle("Escolha a música dentre as opções abaixo:")
    .setImage(
      "https://cdn.discordapp.com/avatars/796845658777976903/24dca11d3c97ad3e8e0855f7ef2bbfc0.png"
    )
    .setFooter(
      "Tenha cuidado!",
      "https://64.media.tumblr.com/b91d7d1bf5b90c1856393b9a0bca6f03/54f93eb2c4a807f3-10/s250x400/de82b02d86ce6e08b2d0ecd578c055bbb8f64d2c.png"
    )
    .addFields(
      {
        name: `${emoji.get("one")} : ${listaVideos[0].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("two")} : ${listaVideos[1].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("three")} : ${listaVideos[2].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("four")} : ${listaVideos[3].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("five")} : ${listaVideos[4].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("six")} : ${listaVideos[5].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("seven")} : ${listaVideos[6].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("eight")} : ${listaVideos[7].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("nine")} : ${listaVideos[8].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("one")}${emoji.get("zero")} : ${
          listaVideos[9].title
        }`,
        value: "\u200b",
      }
    )
    .setTimestamp();

  message.channel.send(embed);

  videosListFromApi = listaVideos;
};

export const playWithSearchParams = async (message) => {
  const selectedIndex = message.content;
  addMusicRequest(message, videosListFromApi[selectedIndex - 1].url);
};
