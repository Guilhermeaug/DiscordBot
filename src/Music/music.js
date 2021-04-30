import Discord from "discord.js";
import pkg from "googleapis";
import ytdl from "discord-ytdl-core";
import SpotifyToYoutube from "spotify-to-youtube";
import { queueMenu, searchMenu } from "../Utils/embededTemplates.js";
import arrayMove from "array-move";
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
let isSearching = false;
let lastMessage;
let channelClient;
let alreadySearched = false;

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
      const userRequested = message.author.username;

      if (message.content.includes("-e")) {
        songQueue.push({
          title: musicTitle,
          url: youtubeUrl,
          length: musicLength,
          userRequested: userRequested,
          earrape: true,
        });
      } else {
        songQueue.push({
          title: musicTitle,
          url: youtubeUrl,
          length: musicLength,
          userRequested: userRequested,
          earrape: false,
        });
      }

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
    //message.channel.send(`A rádio Sr.Cabeça apresenta ${currentSong.title}`);
    let stream;
    if (currentSong.earrape) {
      stream = ytdl(currentSong.url, {
        filter: "audioonly",
        opusEncoded: false,
        fmt: "mp3",
        encoderArgs: ["-af", "bass=g=20,dynaudnorm=f=200,volume=200"],
      });
    } else {
      stream = ytdl(currentSong.url, {
        filter: "audioonly",
        opusEncoded: false,
        fmt: "mp3",
        encoderArgs: ["-af", "bass=g=20,dynaudnorm=f=200"],
      });
    }

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

export const searchByKeyword = async (message, client) => {
  if (!isSearching) {
    isSearching = true;

    const args = message.content.split(" ");
    let removed = args.splice(0, 1);
    const query = args.join(" ");

    lastMessage = message;
    channelClient = client;

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

      videosListFromApi = listaVideos;

      return listaVideos;
    });

    searchMenu(message, listaVideos);

    channelClient.on("message", listenerToOption);
    setTimeout(function () {
      if (!alreadySearched) {
        channelClient.removeListener("message", listenerToOption);
        message.channel.send("Você foi lerdo demais e a busca foi cancelada");
      } else {
        alreadySearched = false;
      }
      isSearching = false;
    }, 8000);
  }
};

const listenerToOption = (option) => {
  let message = lastMessage;

  if (!option) return;

  if (!option.content.startsWith("?")) {
    if (message.author === option.author) {
      if (option.content >= 1 && option.content <= 10) {
        channelClient.removeListener("message", listenerToOption);
        playWithSearchParams(option);
        alreadySearched = true;
        isSearching = false;
      } else if (option.content.toUpperCase() === "CANCEL") {
        channelClient.removeListener("message", listenerToOption);
        message.channel.send(
          `${emoji.get("white_check_mark")} A busca foi cancelada`
        );
        alreadySearched = true;
        isSearching = false;
      }
    }
  }
};

export const playWithSearchParams = async (message) => {
  const selectedIndex = message.content;
  addMusicRequest(message, videosListFromApi[selectedIndex - 1].url);

  message.channel.send(
    `${emoji.get(
      "white_check_mark"
    )} Música adicionada com sucesso na posição \u0060${
      songQueue.length + 1
    }\u0060 !`
  );
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
  if (songQueue.length > 0) {
    queueMenu(message, songQueue);
  } else {
    return message.channel.send(
      "Não há musica alguma na fila, jumento imprestável, hehe"
    );
  }
};

export const clearQueue = (message) => {
  if (!message.member.voice.channel) {
    return message.channel.send(
      "Você não está em um canal de voz, Leticia, Hehehehe"
    );
  }

  songQueue.splice(0, songQueue.length);
  message.channel.send(
    `${emoji.get(
      "white_check_mark"
    )} A fila está limpa, igual a bundinha do leroy!`
  );
};

export const moveQueue = (message) => {
  const positionToMove = message.content.split(" ")[1].substr(0);
  if (songQueue.length > 0) {
    arrayMove.mutate(songQueue, positionToMove - 1, 0);
    message.channel.send(
      `${emoji.get("white_check_mark")} A música \u0060${
        songQueue[0].title
      }\u0060 é a próxima da fila, otário`
    );
  }
};
