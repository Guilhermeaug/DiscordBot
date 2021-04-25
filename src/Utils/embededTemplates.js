import { Client, Emoji, MessageEmbed } from "discord.js";
import { Menu } from "discord.js-menu";
import emoji from "node-emoji";

const createPages = async (videoList) => {
  const pages = [];
  const fields = [];

  //u0060
  //gerando um array de fields para preencher as páginas futuramente
  for (let i = 0; i < videoList.length; i++) {
    let video = videoList[i];
    let videoTitle = video.title;
    let videoUrl = video.url;

    let name = "\u200b";
    let value = `\u0060${i}.\u0060 [${videoTitle}](${videoUrl}) | Pedido por **leroi** `;

    fields.push({ name: name, value: value });
  }

  const numPages = Math.ceil(fields.length / 10);
  console.log("Quantidade de páginas: ", numPages);
  for (let i = 0; i < numPages; i++) {
    /*const embed = new MessageEmbed()
      .setTitle("Menu de comandos encabeçados")
      .setURL("https://www.youtube.com/channel/UC4IOooU_UJ1skJRL0dITXbA")
      .setDescription("Tenha cuidado!")
      .setColor("random")
      .setAuthor("Sr.Cabeça")
      .setFooter(
        "Tenha cuidado!",
        "https://64.media.tumblr.com/b91d7d1bf5b90c1856393b9a0bca6f03/54f93eb2c4a807f3-10/s250x400/de82b02d86ce6e08b2d0ecd578c055bbb8f64d2c.png"
      );*/

    let j = 0;
    let selectedFields = [];
    while (j < 10 && fields.length != 0) {
      selectedFields.push(fields.shift());
      //let field = fields.shift();
      //console.log("Fields: ", field);

      // constembed.addField({name: field.name, value: field.value})
      //embed.addField(fields.shift());
      j++;
    }

    //console.log("j: ", j);
    //console.log("Embed: ", embed);
    //console.log("Fields: ", fields);

    pages.push({
      name: `queuePage-${i}`,
      //content: embed,
      content: new MessageEmbed({
        title: "Menu de comandos encabeçados",
        url: "https://www.youtube.com/channel/UC4IOooU_UJ1skJRL0dITXbA",
        description: "**Tenha cuidado!**",
        color: 0xae00ff,
        author: { name: "Sr.Cabeça" },
        fields: selectedFields,
      }),
      footer: { text: "Fique esperto!" },
      timestamp: new Date(),
      reactions: {
        "😳": "previous",
        "😀": "next",
      },
    });
  }

  return pages;
};

export const queueMenu = async (message, videoList) => {
  console.log("Tamanho do array de videos: ", videoList.length);
  const pages = await createPages(videoList);

  const menu = new Menu(message.channel, message.author.id, pages);
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
        ],
      }),
      footer: { text: "Fique esperto!" },
      timestamp: new Date(),
      reactions: {
        "😀": async () => {
          let res = await message.channel.send("Hey-");
          setTimeout(() => {
            return res.edit("listen!");
          }, 1000);
        },
      },
    },
  ]);

  menu.start();
};

export const embedVideoList = (message, videoList, title) => {
  const aurora = "aurora";

  const embed = new MessageEmbed()
    .setColor(5444442)
    .setTitle(title)
    .setImage(
      "https://cdn.discordapp.com/avatars/796845658777976903/24dca11d3c97ad3e8e0855f7ef2bbfc0.png"
    )
    .setFooter(
      "Tenha cuidado!",
      "https://64.media.tumblr.com/b91d7d1bf5b90c1856393b9a0bca6f03/54f93eb2c4a807f3-10/s250x400/de82b02d86ce6e08b2d0ecd578c055bbb8f64d2c.png"
    )
    .addFields(
      //U+301D
      {
        name: `${emoji.get("one")} : ${
          videoList[0].title
        } [Aurora - Runaway](https://google.com)`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("two")} : ${videoList[1].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("three")} : ${videoList[2].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("four")} : ${videoList[3].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("five")} : ${videoList[4].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("six")} : ${videoList[5].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("seven")} : ${videoList[6].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("eight")} : ${videoList[7].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("nine")} : ${videoList[8].title}`,
        value: "\u200b",
      },
      {
        name: `${emoji.get("one")} ${emoji.get("zero")} : ${
          videoList[9].title
        }`,
        value: "\u200b",
      }
    )
    .setTimestamp();

  message.channel.send(embed);
};
