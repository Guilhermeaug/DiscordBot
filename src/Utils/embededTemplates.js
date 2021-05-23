import { MessageEmbed } from "discord.js";
import pkg from "discord.js-menu";
import format from "format-duration";
const { Menu } = pkg;

export const createFieldsForHltvTeams = (teamsTable) => {
  const fields = [];

  for (let i = 0; i < 10; i++) {
    let team = teamsTable[i];

    let name = "\u200b";
    let value = `\u0060${i + 1}.\u0060 | **${team}**`;
    fields.push({ name: name, value: value });
  }

  return fields;
};

export const createFieldsForHltvProfile = (playerData) => {
  //Player Data:  [ '1.03', '0.63', '29.8%', '30', '0.63', '71.0%' ]
  const fields = [
    {
      name: "\u200b",
      value: `\u0060Rating:\u0060 **${playerData[0]}** `,
    },
    {
      name: "\u200b",
      value: `\u0060Kills por round:\u0060 **${playerData[1]}** `,
    },
    {
      name: "\u200b",
      value: `\u0060Headshots:\u0060 **${playerData[2]}** `,
    },
    {
      name: "\u200b",
      value: `\u0060Mapas jogados:\u0060 **${playerData[3]}** `,
    },
    {
      name: "\u200b",
      value: `\u0060Mortes por round:\u0060 **${playerData[4]}** `,
    },
    {
      name: "\u200b",
      value: `\u0060Porcentagem de rounds em que contribuiu:\u0060 **${playerData[5]}** `,
    },
  ];

  return fields;
};

const createFields = (videoList) => {
  const fields = [];

  for (let i = 0; i < videoList.length; i++) {
    let video = videoList[i];

    let videoTitle = video.title;
    let videoUrl = video.url;
    let videoUser = video.userRequested;
    let videoLength = format(video.length * 1000); //segundos para milisegundos

    let name = "\u200b";
    let value = videoUser
      ? `\u0060${
          i + 1
        }.\u0060 [${videoTitle}](${videoUrl}) | \u0060${videoLength} Pedido por ${videoUser}\u0060 `
      : `\u0060${i + 1}.\u0060 [${videoTitle}](${videoUrl})`;

    fields.push({ name: name, value: value });
  }

  return fields;
};

const createPages = async (message, videoList, title) => {
  const pages = [];
  const fields = createFields(videoList);

  const numPages = Math.ceil(fields.length / 10);
  for (let i = 0; i < numPages; i++) {
    let j = 0;
    let selectedFields = [];
    while (j < 10 && fields.length != 0) {
      selectedFields.push(fields.shift());
      j++;
    }

    pages.push({
      name: `page-${i}`,
      content: new MessageEmbed({
        title: `${title}`,
        url: "https://www.youtube.com/channel/UC4IOooU_UJ1skJRL0dITXbA",
        description: "**Tenha cuidado!**",
        color: 0xae00ff,
        fields: selectedFields,
        footer: {
          text: "Fique esperto!",
          icon_url: `${message.author.avatarURL()}`,
        },
        timestamp: new Date(),
      }),
      reactions: {
        "⬅️": "previous",
        "➡️": "next",
      },
    });
  }

  return pages;
};

export const queueMenu = async (message, videoList) => {
  const pages = await createPages(message, videoList, "Fila de músicas");

  const menu = new Menu(message.channel, message.author.id, pages, 60000);
  menu.start();
};

export const helpMenu = (message) => {
  const menu = new Menu(message.channel, message.author.id, [
    {
      name: "help",
      content: new MessageEmbed({
        title: "Menu de comandos encabeçados",
        url: "https://www.youtube.com/channel/UC4IOooU_UJ1skJRL0dITXbA",
        description: "**Tenha cuidado!**",
        color: 0xae00ff,
        author: { name: "Sr.Cabeça" },
        fields: [
          {
            name: "?play: toca um link do youtube",
            value: "\u200b",
          },
          {
            name: "?search: pesquisa uma música por palavras-chave",
            value: "\u200b",
          },
          {
            name: "?skip: pula para a próxima posição da lista de músicas",
            value: "\u200b",
          },
          {
            name: "?queue: lista as músicas atuais da fila do servidor",
            value: "\u200b",
          },
          {
            name: "?move: move a música da posição escolhida para a primeira da fila",
            value: "\u200b",
          },
        ],
        footer: { text: "Fique esperto!" },
      }),
    },
  ]);

  menu.start();
};

export const searchMenu = (message, videoList) => {
  const videosField = createFields(videoList);
  const embedSearchMenu = new MessageEmbed({
    title: "Escolha uma das opções abaixo: ",
    url: "https://www.youtube.com/channel/UC4IOooU_UJ1skJRL0dITXbA",
    description: "**Tenha cuidado!**",
    color: 0xae00ff,
    author: { name: "Sr.Cabeça" },
    fields: videosField,
    footer: { text: "Fique esperto!" },
  });

  const messageSent = message.channel.send(embedSearchMenu);

  return messageSent;
};
