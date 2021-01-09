
const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://www.hltv.org/ranking/teams/';


axios(url).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const tabelaStatus = $('.ranking-header');
    const tabelaTimes = [];

    tabelaStatus.each(function () {
        const nomeTime = $(this).find('.team-logo > img').attr('title');
        const posicaoTime = $(this).find('.position').text();

        tabelaTimes.push({
            nomeTime,
            posicaoTime
        });
    });

}).catch(console.error);


