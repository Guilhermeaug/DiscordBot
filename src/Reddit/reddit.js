import Discord from "discord.js";
import snoowrap from "snoowrap";
import dotenv from "dotenv";
import request from "request";
import rp from "request-promise";
import { isNsfw } from "../Utils/asserts.js";
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
    const post = await r.getSubreddit(subreddit).getRandomSubmission();

    if (post.preview == null || post.preview.images == null) {
      getPostFromSubreddit(message, subreddit);
      return;
    }

    const imageData = post.preview.images[0].source;
    const image = {
      url: imageData.url,
      width: imageData.width,
      height: imageData.height,
    };

    if (image.url.includes("external")) {
      getPostFromSubreddit(message, subreddit);
      return;
    }

    const requestUrl = image.url.replace("preview", "i");
    const requestUrlPng = requestUrl.concat(".png");
    redditPostToEmbed(message, requestUrlPng);

    /*const stream = request(requestUrl)
      .on("error", function (err) {})
      .pipe(fs.createWriteStream("leroy.png"));

    stream.on("finish", async function () {
      await redditPostToEmbed(message);
    });*/
  } else {
    message.channel.send("Só em um canal para maiores de 18 criança");
  }
};

const redditPostToEmbed = (message, image) => {
  /*const attachment = new Discord.MessageAttachment("leroy.png", "leroy.png");
  const embed = new Discord.MessageEmbed()
    .attachFiles(attachment)
    .setImage("attachment://leroy.png");

  message.channel
    .send(embed)
    .then((message) => message.delete({ timeout: 20000 }));*/

  //console.log(image);

  const embed = new Discord.MessageEmbed().setColor("#0099ff").setImage(image);

  message.channel
    .send(embed)
    .then((message) => message.delete({ timeout: 20000 }));

  message.delete();
};
