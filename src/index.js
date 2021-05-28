import Discord from "discord.js";
import dotenv from "dotenv";
import { Ranking, getHltvPlayer, getPlayerOfTheWeek } from "./Hltv/hltv.js";
import {
  addMusicRequest,
  skipSong,
  searchByKeyword,
  showQueue,
  clearQueue,
  moveQueue,
} from "./Music/music.js";
import { getPostFromSubreddit } from "./Reddit/reddit.js";
import { peopleMessages, randomMessages } from "./Utils/constants.js";
import { helpMenu } from "./Utils/embededTemplates.js";
import emoji from "node-emoji";

dotenv.config();

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Vou botar para arrombar!");

  client.user.setPresence({
    activity: { name: "comendo cu de curioso" },
    status: "PLAYING",
  });
});

const sendMessage = (message, messageToPeople) => {
  message.channel.send(messageToPeople);
};

const randomMessage = (message) => {
  const randomNumber = Math.floor(Math.random() * randomMessages.length);
  message.channel.send(randomMessages[randomNumber]);
};

const clearChannel = async (message, quantity) => {
  let getMessages;
  quantity
    ? (getMessages = await message.channel.messages.fetch({
        limit: quantity,
      }))
    : (getMessages = await message.channel.messages.fetch());

  message.channel.bulkDelete(getMessages);
};

client.on("message", (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith("?")) return;

  const content = message.content.split(" ")[0].substr(1);

  if (content !== "") {
    peopleMessages.forEach((el) => {
      if (el.people === content) {
        sendMessage(message, el.message);
      }
    });
  }

  if (message.content.includes("?clearChannel")) {
    const messagesToDelete = message.content.split(" ")[1];
    const quantity = parseInt(messagesToDelete, 10);

    clearChannel(message, quantity);
  }

  if (message.content.startsWith("?search")) {
    searchByKeyword(message, client);
  }

  if (message.content.startsWith("?play")) {
    addMusicRequest(message);
  }

  if (message.content.startsWith("?stats")) {
    getHltvPlayer(message);
  }

  if (message.content.startsWith("?move")) {
    moveQueue(message);
  }

  switch (message.content) {
    case "?amouranth":
      getPostFromSubreddit(message, "amouranth");
      break;

    case "?nsfw":
      getPostFromSubreddit(message, "pornhub");
      break;

    case "?indiefox":
      getPostFromSubreddit(message, "indiefoxxreddit");
      break;

    case "?love":
      getPostFromSubreddit(message, "lovelilah");
      break;

    case "?men":
      getPostFromSubreddit(message, "hotmen");
      break;

    case "?monkey":
      getPostFromSubreddit(message, "monkeys");
      break;

    case "?eu":
      randomMessage(message);
      break;

    case "?queue":
      showQueue(message);
      break;

    case "?clear":
      clearQueue(message);
      break;

    case "?skip":
      skipSong(message);
      break;

    case "?hltv":
      Ranking(message);
      break;

    case "?pw":
      getPlayerOfTheWeek(message);
      break;

    case "?help":
      helpMenu(message);
      break;

    default:
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
