import Discord from "discord.js";
import snoowrap from "snoowrap";
import dotenv from "dotenv";
import { isNsfw } from "../Utils/asserts.js";

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
  if (isNsfw(message) || subreddit == "amouranth" || subreddit == "indiefoxxreddit" || subreddit == "monkeys") {
    const post = await r.getSubreddit(subreddit).getRandomSubmission();

    if (!post.url.includes(".jpg")) {
      getPostFromSubreddit(message, subreddit);
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
