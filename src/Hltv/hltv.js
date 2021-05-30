import Discord from "discord.js";
import {
  createFieldsForHltvTeams,
  createFieldsForHltvProfile,
} from "../Utils/embededTemplates.js";
import puppeteer from "puppeteer";
import emoji from "node-emoji";

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

//deprecated xD
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
  });
};

export const getHltvFrontPage = async (message) => {
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
    "body > div.bgPadding > div > div.colCon > div.contentCol > div.index > div.hero-con"
  );

  const element = await page.$(
    "body > div.bgPadding > div > div.colCon > div.contentCol > div.index > div.hero-con"
  );
  await element.screenshot({ path: "hltv.png" });

  const imageLink = await page
    .evaluate(() => {
      return document
        .querySelector(
          "body > div.bgPadding > div > div.colCon > div.contentCol > div.index > div.hero-con > a"
        )
        .getAttribute("href");
    })
    .catch((e) => {});

  let pages = await browser.pages();
  await Promise.all(pages.map((page) => page.close()));
  await browser.close().then(() => {
    embedLocalImage(message, "Main news", imageLink);
  });
};

export const getFullPlayerStats = async (message) => {
  const playerName = message.content.split(" ")[1].substr(0);
  if (!playerName) return;

  const url = `https://www.hltv.org/search?query=${playerName}`;

  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1600,900",
    ],
  });

  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1600,
    height: 900,
  });
  await page.waitForSelector(".table").catch((e) => {});
  await page.click(".table > tbody > tr > td > a").catch((e) => {});

  const urlArgs = page.url().split("/");
  const link = `https://www.hltv.org/stats/players/${urlArgs[4]}/${playerName}`;
  await page.goto(link);
  await page.waitForSelector("div.stats-player-overview");
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    const sectionTitles = document.querySelectorAll("span.standard-headline");
    const sectionSubtitles = document.querySelectorAll(
      "span.featured-sub-text"
    );
    const vSpaces = document.querySelectorAll(
      "div.stats-player-overview > div.vspace"
    );
    let ad = document.querySelector("#stats_1");
    let topMenu = document.querySelector("div.stats-top-menu");
    let bottomMenu = document.querySelector("div.gtSmartphone-only");
    let button = document.querySelector("div.summaryBodyshotContainer > div");
    let legend = document.querySelector(
      "div.summaryShortInfo > div.summaryLegendContainer"
    );
    let sectionSpacer = document.querySelectorAll("div.section-spacer");
    let sectionFeatureRankings = document.querySelector(
      "div.featured-ratings-container"
    );
    let sectionTeammates = document.querySelector("div.grid.teammates");
    let sectionGraph = document.querySelector(
      "div.stats-player-overview > div.standard-box"
    );
    let cookies = document.querySelector("#CybotCookiebotDialog");

    if (sectionTitles)
      sectionTitles.forEach((item) => {
        item.remove();
      });
    if (sectionSubtitles)
      sectionSubtitles.forEach((item) => {
        item.remove();
      });
    vSpaces.forEach((item) => {
      item.remove();
    });
    if (ad) ad.remove();
    if (topMenu) topMenu.remove();
    if (bottomMenu) bottomMenu.remove();
    if (button) button.remove();
    if (legend) legend.remove();
    if (sectionSpacer)
      sectionSpacer.forEach((item) => {
        item.remove();
      });
    if (sectionFeatureRankings) sectionFeatureRankings.remove();
    if (sectionTeammates) sectionTeammates.remove();
    if (sectionGraph) sectionGraph.remove();
    if (cookies) cookies.remove();
  });

  const element = await page.$("div.stats-player-overview");
  await element.screenshot({ path: "hltv.png" }).then(() => {
    embedLocalImage(message);
  });

  let pages = await browser.pages();
  await Promise.all(pages.map((page) => page.close()));
  await browser.close();
};

const embedLocalImage = (message, title, link) => {
  const attachment = new Discord.MessageAttachment("./hltv.png", "hltv.png");
  let embed;

  if (link && title) {
    embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setURL(link)
      .attachFiles(attachment)
      .setImage("attachment://hltv.png");
  } else {
    embed = new Discord.MessageEmbed()
      .attachFiles(attachment)
      .setImage("attachment://hltv.png");
  }

  message.channel.send({ embed });
};
