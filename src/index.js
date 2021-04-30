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

  // Set the client user's presence
  client.user.setPresence({
    activity: { name: "comendo cu de curioso" },
    status: "PLAYING",
  });
});

const sendMessage = (message, messageToPeople) => {
  message.channel.send(messageToPeople);
};

function randomMessage(message) {
  const randomNumber = Math.floor(Math.random() * randomMessages.length);
  message.channel.send(randomMessages[randomNumber]);
}

client.on("message", (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith("?")) return;

  const content = message.content.split(" ")[0].substr(1); // gets the command name

  if (content !== "") {
    peopleMessages.forEach((el) => {
      if (el.people === content) {
        sendMessage(message, el.message);
      }
    });
  }

  if (message.content.startsWith("?amouranth")) {
    getPostFromSubredditAmouranth(message);
  }

  if (message.content.startsWith("?nsfw")) {
    getPostFromSubredditNsfw(message);
  }

  if (message.content.startsWith("?indiefox")) {
    getPostFromSubredditFox(message);
  }

  if (message.content.startsWith("?men")) {
    getPostFromSubredditMen(message);
  }

  if (message.content.startsWith("?eu")) {
    randomMessage(message);
  }

  if (message.content.startsWith("?play")) {
    addMusicRequest(message);
  }

  if (message.content.startsWith("?queue")) {
    showQueue(message);
  }

  if (message.content.startsWith("?move")) {
    moveQueue(message);
  }

  if (message.content.startsWith("?clear")) {
    clearQueue(message);
  }

  if (message.content.startsWith("?skip")) {
    skipSong(message);
  }

  if (message.content.startsWith("?search")) {
    searchByKeyword(message, client);
  }

  if (message.content.startsWith("?hltv")) {
    Ranking(message);
  }

  if (message.content === "?help") {
    helpMenu(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
