const { google } = require('googleapis');
const ytdl = require("ytdl-core");
const emoji = require("node-emoji");
const Discord = require("discord.js");
const StringBuilder = require("string-builder");

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_TOKEN
})

const queue = new Map();
var listaVideos;

module.exports = { queue: queue };

async function searchByKeyword(message, serverQueue) {
    const args = message.content.split(" ");
    let removed = args.splice(0, 1);
    //const keyWords = args.join('+')
    const query = args.join(' ');

    let request = async () => {
        var results = youtube.search.list({
            q: query,
            part: 'snippet',
            type: 'video',
            maxResults: 10
        }).catch(console.error);

        return results;
    }

    const listaVideos = await request().then(results => {
        const listaVideos = { videos: [] }
        const listItems = results.data.items;
        listItems.forEach(item => {
            var musica = { url: '', title: '' }

            const videoId = item.id.videoId;
            const videoTitle = item.snippet.title;

            musica.url = `https://www.youtube.com/watch?v=${videoId}`;
            musica.title = videoTitle;

            listaVideos.videos.push(musica);
        });

        return listaVideos;

    });

    const embed = new Discord.MessageEmbed()
        .setColor(5444442)
        .setTitle('Escolha a música dentre as opções abaixo:')
        .setImage('https://cdn.discordapp.com/avatars/796845658777976903/24dca11d3c97ad3e8e0855f7ef2bbfc0.png')
        .setFooter('Tenha cuidado!', 'https://64.media.tumblr.com/b91d7d1bf5b90c1856393b9a0bca6f03/54f93eb2c4a807f3-10/s250x400/de82b02d86ce6e08b2d0ecd578c055bbb8f64d2c.png')
        .addFields(
            { name: `${emoji.get('one')} : ${listaVideos.videos[0].title}`, value: '\u200b' },
            { name: `${emoji.get('two')} : ${listaVideos.videos[1].title}`, value: '\u200b' },
            { name: `${emoji.get('three')} : ${listaVideos.videos[2].title}`, value: '\u200b' },
            { name: `${emoji.get('four')} : ${listaVideos.videos[3].title}`, value: '\u200b' },
            { name: `${emoji.get('five')} : ${listaVideos.videos[4].title}`, value: '\u200b' },
            { name: `${emoji.get('six')} : ${listaVideos.videos[5].title}`, value: '\u200b' },
            { name: `${emoji.get('seven')} : ${listaVideos.videos[6].title}`, value: '\u200b' },
            { name: `${emoji.get('eight')} : ${listaVideos.videos[7].title}`, value: '\u200b' },
            { name: `${emoji.get('nine')} : ${listaVideos.videos[8].title}`, value: '\u200b' },
            { name: `${emoji.get('one')}${emoji.get('zero')} : ${listaVideos.videos[9].title}`, value: '\u200b' })
        .setTimestamp();

    message.channel.send(embed);

    return listaVideos;
}

module.exports.Execute = async function execute(message, serverQueue) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        console.error("No voice channel found");
        return message.reply("Você não está em um canal de voz, letícia. hehe");
    }

    const song = { // separa apenas o necessario
        title: '',
        url: ''
    };

    if (listaVideos) {
        const url = 'youtube.com'.concat(listaVideos.videos[message.content - 1].url);
        const songInfo = await ytdl.getInfo(url);
        song.title = songInfo.videoDetails.title;
        song.url = songInfo.videoDetails.video_url;
        listaVideos = null;
    } else {
        const args = message.content.split(" ");
        const songInfo = await ytdl.getInfo(args[1]); // a api pega todas as informacoes
        song.title = songInfo.videoDetails.title;
        song.url = songInfo.videoDetails.video_url;
    }

    if (!serverQueue) {
        const queueBuilder = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 2,
            playing: true
        };

        queue.set(message.guild.id, queueBuilder);

        queueBuilder.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueBuilder.connection = connection;
            play(message.guild.id, queueBuilder.songs[0]);
        } catch (error) {
            console.log(error);
            queue.delete(message.guild.id);
            return message.channel.send(error);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} entrou na fila`);
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

module.exports.ShowQueue = function showQueue(message, serverQueue) {

    if (serverQueue) {
        let sb = new StringBuilder();
        serverQueue.songs.forEach(function (item, index) {
            sb.appendFormat("{0}: {1}", index, item.title);
            sb.appendLine();
        });

        message.channel.send(sb.toString());
        sb.append(null);
    }
}

module.exports.CleanQueue = function cleanQueue(message, serverQueue) {
    if (serverQueue) {
        serverQueue.songs = [];
    }
}

module.exports.SkipQueue = function skipQueue(message, serverQueue) {
    if (!serverQueue)
        return message.channel.send("Larga a mão de ser mula!");

    serverQueue.connection.dispatcher.end();
}

module.exports.ClearQueue = function clearQueue(message, serverQueue) {
    if (!serverQueue)
        return message.channel.send('Larga a mão de ser mula!');

    serverQueue.voiceChannel.leave();
    queue.delete(message.guild.id);

}

module.exports.ChangeVolume = function changeVolume(message, serverQueue) {
    const args = message.content.split(" ");
    const volume = args[1];
    serverQueue.volume = volume;
}

module.exports.Arromba = async function arromba(message, serverQueue) {
    listaVideos = await teste(message, serverQueue);
}

async function teste(message, serverQueue) {
    let recupera = async () => {
        return searchByKeyword(message, serverQueue);
    }

    const listaVideos = await recupera().then((value) => {
        return value;
    }).catch(console.error)

    return listaVideos;
}