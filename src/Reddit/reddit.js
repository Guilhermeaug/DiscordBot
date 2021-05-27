import Discord from "discord.js";
import snoowrap from "snoowrap";
import dotenv from "dotenv";
import request from "request";
import rp from "request-promise";
import { isNsfw, isThereAnyImages, isValidUrl } from "../Utils/asserts.js";
import fs from "fs";

//import leroy from '../leroy'; --> amuleto da sorte --> que Deus nos abençoe

dotenv.config();

const r = new snoowrap({
  userAgent: "discord-bot-cefetmg",
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS,
});

export const getPostFromSubreddit = async (message, subreddit) => {
  if (
    isNsfw(message) ||
    subreddit == "amouranth" ||
    subreddit == "indiefoxxreddit" ||
    subreddit == "monkeys"
  ) {
''    const post = await r.getSubreddit(subreddit).getRandomSubmission();
    let imageUrl;

    if (!isThereAnyImages(post)) {
      if(post.url.includes(".jpg") || post.url.includes(".png")){
        redditPostToEmbed(message, post.url);
      } else {
        getPostFromSubreddit(message, subreddit);
      }
      
      return;
    } else {
      imageUrl = post.preview.images[0].source.url;
    }

    if (!isValidUrl(imageUrl)) {
      getPostFromSubreddit(message, subreddit);
      return;
    }

    const requestUrl = imageUrl.replace("preview", "i");
    const requestUrlPng = requestUrl.concat(".png");

    redditPostToEmbed(message, requestUrlPng);
  } else {
    message.channel.send("Só em um canal para maiores de 18 criança");
  }
};

const redditPostToEmbed = (message, image) => {
  const embed = new Discord.MessageEmbed().setColor("##ff0000").setImage(image);

  message.channel
    .send(embed)
    .then((message) => message.delete({ timeout: 20000 })); // deleta a mensagem do bot

  message.delete({ timeout: 20000 }); // deleta a mensagem do usuario
};
