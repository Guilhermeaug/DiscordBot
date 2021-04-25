import Discord from "discord.js";
import pkg from "googleapis";
import ytdl from "discord-ytdl-core";
import emoji from "node-emoji";
import { embedVideoList, helpMenu, queueMenu } from "../Utils/embededTemplates.js";
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

      console.log(songQueue.length);

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
        maxResults: 20,
      })
      .catch(console.error);
    return results;
  };

  const videos = await request();

  const arrayUrlVideos = videos.data.items.map((el) => {
    const url = `https://www.youtube.com/watch?v=${el.contentDetails.videoId}`;
    return url;
  });

  for (let i = 0; i < arrayUrlVideos.length; i++) {
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
        maxResults: 20,
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

    videosListFromApi = listaVideos;

    return listaVideos;
    
  });

  embedVideoList(message, listaVideos, "Escolha uma das opções abaixo");
  
};

export const playWithSearchParams = async (message) => {
  const selectedIndex = message.content;
  addMusicRequest(message, videosListFromApi[selectedIndex - 1].url);
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

export const showQueue = (message) => {
  queueMenu(message, songQueue);
}
