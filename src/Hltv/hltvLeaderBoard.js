const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://www.hltv.org/ranking/teams/";
const StringBuilder = require("string-builder");
const sb = new StringBuilder();

module.exports.Ranking = function (message) {
  let sb = new StringBuilder();
  axios(url)
    .then((response, err) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const tabelaStatus = $(".ranking-header");
      const tabelaTimes = [];

      tabelaStatus.each(function () {
        const nomeTime = $(this).find(".team-logo > img").attr("title");
        const posicaoTime = $(this).find(".position").text();

        tabelaTimes.push({
          nomeTime,
          posicaoTime,
        });
      });

      sb.append("RANKING HLTV 100% ATUALIZADO");
      sb.appendLine();

      for (let i = 0; i < 10; i++) {
        sb.appendFormat(
          "{0} --- {1} {2}",
          tabelaTimes[i].posicaoTime,
          tabelaTimes[i].nomeTime
        );
        sb.appendLine();
      }

      message.channel.send(sb.toString());

      sb = null;
    })
    .catch(console.error);
}
