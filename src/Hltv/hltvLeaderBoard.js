import Discord from "discord.js";
import emoji from "node-emoji";
import puppeteer from "puppeteer";

const url = "https://www.hltv.org/ranking/teams/";

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    const teams = [];

    Array.from(document.querySelectorAll('div.ranked-team')).map(
      (team) => {
        let name = team.getElementsByClassName('name')[0].innerText;
        let ranking = team.getElementsByClassName('position')[0].innerText;
        teams.push({ nomeTime: name, ranking });
      }
    )

    return teams;

  })

  browser.close()
  return result

}

const Ranking = async (message) => {
  const tabelaTimes = await scrape();

  const embed = new Discord.MessageEmbed()
    .setColor(5444442)
    .setTitle('RANKING HLTV 100% ATUALIZADO:')
    .setImage('https://cdn.discordapp.com/avatars/796845658777976903/24dca11d3c97ad3e8e0855f7ef2bbfc0.png')
    .setFooter('Tenha cuidado!', 'https://64.media.tumblr.com/b91d7d1bf5b90c1856393b9a0bca6f03/54f93eb2c4a807f3-10/s250x400/de82b02d86ce6e08b2d0ecd578c055bbb8f64d2c.png')
    .addFields(
      { name: `${emoji.get('one')} : ${tabelaTimes[0].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('two')} : ${tabelaTimes[1].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('three')} : ${tabelaTimes[2].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('four')} : ${tabelaTimes[3].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('five')} : ${tabelaTimes[4].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('six')} : ${tabelaTimes[5].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('seven')} : ${tabelaTimes[6].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('eight')} : ${tabelaTimes[7].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('nine')} : ${tabelaTimes[8].nomeTime}`, value: '\u200b' },
      { name: `${emoji.get('one')}${emoji.get('zero')} : ${tabelaTimes[9].nomeTime}`, value: '\u200b' })
    .setTimestamp();

  message.channel.send(embed);
  
}

export {
  Ranking
};
