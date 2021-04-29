import Discord from "discord.js";
import snoowrap from "snoowrap";
import dotenv from "dotenv";

//import leroy from '../leroy'; --> amuleto da sorte --> que Deus nos abençoe

dotenv.config();

const r = new snoowrap({
  userAgent: "discord-bot-cefetmg",
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS,
});

export const getPostFromSubredditAmouranth = async (message) => {
  const post = await r.getSubreddit("Amouranth").getRandomSubmission();

  if (!post.url.includes(".jpg")) {
    getPostFromSubredditAmouranth(message);
  } else {
    redditPostToEmbed(message, post);
  }
};

export const getPostFromSubredditFox = async (message) => {
  const post = await r.getSubreddit("indiefoxxreddit").getRandomSubmission();

  if (!post.url.includes(".jpg")) {
    getPostFromSubredditFox(message);
  } else {
    redditPostToEmbed(message, post);
  }
};

export const getPostFromSubredditNsfw = async (message) => {
  const post = await r.getSubreddit("nsfw").getRandomSubmission();

  if (!post.url.includes(".jpg")) {
    getPostFromSubredditNsfw(message);
  } else {
    redditPostToEmbed(message, post);
  }
};

const redditPostToEmbed = (message, post) => {
  console.log(post.url);
  let image = post.url;

  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(post.title)
    .setURL("http://reddit.com" + post.permalink)
    .setAuthor(post.author.name)
    .setImage(image)
    .setTimestamp();

  message.channel.send(embed);
};
