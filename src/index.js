import Discord from "discord.js";
import dotenv from "dotenv";
import { Ranking } from "./Hltv/hltvLeaderBoard.js";
import {
  addMusicRequest,
  skipSong,
  searchByKeyword,
  showQueue,
  clearQueue,
  moveQueue,
} from "./Music/music.js";
import {
  getPostFromSubredditAmouranth,
  getPostFromSubredditFox,
  getPostFromSubredditNsfw,
  getPostFromSubredditMen,
} from "./Reddit/reddit.js";
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

  switch (message.content) {
    case "?amouranth":
      getPostFromSubredditAmouranth(message);
      break;

    case "?nsfw":
      getPostFromSubredditNsfw(message);
      break;

    case "?indiefox":
      getPostFromSubredditFox(message);
      break;

    case "?men":
      getPostFromSubredditMen(message);
      break;

    case "?eu":
      randomMessage(message);
      break;

    case "?play":
      addMusicRequest(message);
      break;

    case "?queue":
      showQueue(message);
      break;

    case "?move":
      moveQueue(message);
      break;

    case "?clear":
      clearQueue(message);
      break;

    case "?skip":
      skipSong(message);
      break;

    case "?search":
      searchByKeyword(message, client);
      break;

    case "?hltv":
      Ranking(message);
      break;

    case "?help":
      helpMenu(message);
      break;

    default:
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
