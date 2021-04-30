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

const isNsfw = (message) => {
  return message.channel.nsfw;
};

export const getPostFromSubredditAmouranth = async (message) => {
  if (isNsfw(message)) {
    const post = await r.getSubreddit("Amouranth").getRandomSubmission();

    if (!post.url.includes(".jpg")) {
      getPostFromSubredditAmouranth(message);
    } else {
      redditPostToEmbed(message, post);
    }
  } else {
    message.channel.send("Só em um canal para maiores de 18 criança");
  }
};

export const getPostFromSubredditFox = async (message) => {
  if (isNsfw(message)) {
    const post = await r.getSubreddit("indiefoxxreddit").getRandomSubmission();

    if (!post.url.includes(".jpg")) {
      getPostFromSubredditFox(message);
    } else {
      redditPostToEmbed(message, post);
    }
  } else {
    message.channel.send("Só em um canal para maiores de 18 criança");
  }
};

export const getPostFromSubredditNsfw = async (message) => {
  if (isNsfw(message)) {
    const post = await r.getSubreddit("pornhub").getRandomSubmission();

    if (!post.url.includes(".jpg")) {
      getPostFromSubredditNsfw(message);
    } else {
      redditPostToEmbed(message, post);
    }
  } else {
    message.channel.send("Só em um canal para maiores de 18 criança");
  }
};

export const getPostFromSubredditMen = async (message) => {
  const post = await r.getSubreddit("hotmen").getRandomSubmission();

  if (isNsfw(message)) {
    if (!post.url.includes(".jpg")) {
      getPostFromSubredditMen(message);
    } else {
      redditPostToEmbed(message, post);
    }
  } else {
    message.channel.send("Só em um canal para maiores de 18 criança");
  }
};

const redditPostToEmbed = (message, post) => {
  let image = post.url;

  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(post.title)
    .setURL("http://reddit.com" + post.permalink)
    .setAuthor(post.author.name)
    .setImage(image)
    .setTimestamp();

  message.channel
    .send(embed)
    .then((message) => message.delete({ timeout: 10000 }));
};
