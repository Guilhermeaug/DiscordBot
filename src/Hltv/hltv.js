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
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url);
  const result = await page
    .evaluate(() => {
      const teams = Array.from(
        document.querySelectorAll("div.ranked-team")
      ).map((team) => {
        return team.getElementsByClassName("name")[0].innerText;
      });
      return teams;
    })
    .catch((e) => {});

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
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() == "stylesheet" || req.resourceType() == "font") {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url);
  /*await page.goto("https://www.hltv.org/");
  await page.click("[name=query]");
  await page.keyboard.type("fallen");
  await page.keyboard.press("Enter");*/
  await page.waitForSelector(".table").catch((e) => {});
  await page.click(".table > tbody > tr > td > a").catch((e) => {});
  await page.waitForSelector("div.player-stat").catch((e) => {});
  await page.waitForSelector("img.bodyshot-img").catch((e) => {});

  const playerData = await page
    .evaluate(() => {
      const stats = Array.from(
        document.querySelectorAll("div.player-stat")
      ).map((playerStat) => {
        return playerStat.getElementsByClassName("statsVal")[0].innerText;
      });
      return stats;
    })
    .catch((e) => {});

  const playerImage = await page
    .evaluate(() => {
      return document.querySelector(".bodyshot-img").getAttribute("src");
    })
    .catch((e) => {});

  const playerPageUrl = page.url();

  browser.close();

  const profileFields = createFieldsForHltvProfile(playerData);
  const embedHltvProfile = new Discord.MessageEmbed({
    title: `${playerName.toUpperCase()}`,
    url: `${playerPageUrl}`,
    thumbnail: {
      url: `${playerImage}`,
    },
    color: "#2DDD",
    fields: profileFields,
  });

  message.channel.send(embedHltvProfile);
};

export const getPlayerOfTheWeek = async (message) => {
  const url = `https://hltv.org`;

  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1600,900",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 900,
  });
  await page.goto(url);
  await page.waitForSelector(
    "body > div.bgPadding > div > div.colCon > div.leftCol > aside:nth-child(2)"
  );

  const element = await page.$(
    "body > div.bgPadding > div > div.colCon > div.leftCol > aside:nth-child(2)"
  );
  await element.screenshot({ path: "hltv.png" });

  let pages = await browser.pages();
  await Promise.all(pages.map((page) => page.close()));
  await browser.close().then(() => {
    embedLocalImage(message);
  })
};

const embedLocalImage = (message) => {
  const attachment = new Discord.MessageAttachment(
    "./hltv.png",
    "hltv.png"
  );
  const embed = new Discord.MessageEmbed()
    .attachFiles(attachment)
    .setImage("attachment://hltv.png");

  message.channel.send({ embed });
};
