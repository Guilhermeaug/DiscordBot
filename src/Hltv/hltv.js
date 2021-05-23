import Discord from "discord.js";
import {
  createFieldsForHltvTeams,
  createFieldsForHltvProfile,
} from "../Utils/embededTemplates.js";
import puppeteer from "puppeteer";

const getHltvTeams = async () => {
  const url = "https://www.hltv.org/ranking/teams/";

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    const teams = [];

    Array.from(document.querySelectorAll("div.ranked-team")).map((team) => {
      let name = team.getElementsByClassName("name")[0].innerText;
      teams.push(name);
    });

    return teams;
  }).catch((e) => {});

  browser.close();

  return result;
};

export const Ranking = async (message) => {
  const teamsTable = await getHltvTeams();
  const teamsFields = createFieldsForHltvTeams(teamsTable);

  const embedHltvTop10 = new Discord.MessageEmbed({
    title: "RANKING HLTV 100 % ATUALIZADO",
    url: "https://www.hltv.org/ranking/teams/",
    description: "**Tenha cuidado!**",
    color: "#2DDD60",
    fields: teamsFields,
    footer: { text: "Fique esperto!" },
  });
  message.channel.send(embedHltvTop10);
};

export const getHltvPlayer = async (message) => {
  const playerName = message.content.split(" ")[1].substr(0);
  if (!playerName) return;

  const url = `https://www.hltv.org/search?query=${playerName}`;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(url);
  /*await page.goto("https://www.hltv.org/");
  await page.click("[name=query]");
  await page.keyboard.type("fallen");
  await page.keyboard.press("Enter");*/
  await page.waitForSelector(".table");
  await page.click(".table > tbody > tr > td > a");
  await page.waitForSelector("div.player-stat");
  await page.waitForSelector("img.bodyshot-img");

  const playerData = await page.evaluate(() => {
    const stats = [];

    Array.from(document.querySelectorAll("div.player-stat")).map(
      (playerStat) => {
        let statValue =
          playerStat.getElementsByClassName("statsVal")[0].innerText;
        stats.push(statValue);
      }
    );
    return stats;
  }).catch((e) => {});

  const playerImage = await page.evaluate(() => {
    const image = document.querySelector(".bodyshot-img").getAttribute("src");
    return image;
  }).catch((e) => {});

  browser.close();

  const profileFields = createFieldsForHltvProfile(playerData);
  const embedHltvProfile = new Discord.MessageEmbed({
    title: `${playerName.toUpperCase()}`,
    url: `${url}`,
    thumbnail: {
      url: `${playerImage}`,
    },
    color: "#2DDD",
    fields: profileFields,
  });

  message.channel.send(embedHltvProfile);
};
