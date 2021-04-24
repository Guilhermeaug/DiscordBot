import Discord from "discord.js";
import emoji from "node-emoji";
import dotenv from "dotenv";

dotenv.config();

import { Ranking } from "./Hltv/hltvLeaderBoard.js";
// const music = require("./Music/music.js")

const client = new Discord.Client();

// const StringBuilder = require("string-builder");

client.once("ready", () => {
  console.log("Vou botar para arrombar!");
});

const peopleMessages = [
  {
    people: "leroy",
    message: "Leeeeerooooyyyyy JEEENNNNKINS",
  },
  {
    people: "lett",
    message: `<3 ${emoji.get("couplekiss")}`,
  },
  {
    people: "thaix",
    message: `<3 ${emoji.get("heart")} ${emoji.get("couplekiss")}`,
  },
  {
    people: "pablo",
    message: "talarico",
  },
  {
    people: "eliza",
    message: `<3 ${emoji.get("heart")}`,
  },
  {
    people: "gustavo",
    message: "tubarão",
  },
  {
    people: "russo",
    message: "desgraçado",
  },
  {
    people: "jair",
    message: "nu cê tá fraquin zé",
  },
  {
    people: "anna",
    message: "balombra",
  },
  {
    people: "guilherme",
    message: "!play Leno Brega Trepada em Cuiabá",
  },
];

const randomMessages = [
  "Tu é muito estranho",
  "puta",
  "nem te conheço",
  "Para de me chamar",
  "CHATOOO PRA CARAIO",
  "Pensei que você tinha morrido",
  "Flagelado",
  "Bolsonaro",
  "Bolsa de colostomia",
];

const sendMessage = (message, messageToPeople) => {
  message.channel.send(messageToPeople);
};

function kick(message) {
  const user = message.mentions.users.first();
  if (user) {
    const member = message.guild.member(user);
    if (member) {
      member
        .kick("Optional reason that will display in the audit logs")
        .then(() => {
          message.reply(`Botei o ${user.tag} para mamar com sucesso!`);
        })
        .catch((err) => {
          message.reply("I was unable to kick the member");
          console.error(err);
        });
    } else {
      message.reply("That user isn't in this guild!");
    }
  } else message.reply("You didn't mention the user to kick!");
}

function randomMessage(message) {
  const randomNumber = Math.floor(Math.random() * randomMessages.length);
  message.channel.send(randomMessages[randomNumber]);
}

let mensagem = new Discord.Message();

client.on("message", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("?")) return;

  // const serverQueue = music.queue.get(message.guild.id);

  const content = message.content.split(" ")[0].substr(1); // gets the command name

  if (content !== "") {
    peopleMessages.map((el) => {
      if (el.people === content) {
        sendMessage(message, el.message);
      }
    });
  }

  if (message.content.startsWith("?chuteLeroi")) {
    kick(message);
  }
  if (message.content.startsWith("?eu")) {
    randomMessage(message);
  }

  if (message.content.startsWith("?play")) {
    //execute(message, serverQueue, null);
    music.Execute(message, serverQueue, null);
  }

  if (message.content.startsWith("?queue")) {
    music.ShowQueue(message, serverQueue);
  }

  if (message.content.startsWith("?clean")) {
    music.CleanQueue(message, serverQueue);
  }

  if (message.content.startsWith("?skip")) {
    music.SkipQueue(message, serverQueue);
  }

  if (message.content.startsWith("?volume")) {
    music.ChangeVolume(message, serverQueue);
  }

  if (message.content.startsWith("?search")) {
    mensagem = message;
    //arromba(message, serverQueue);
    music.Arromba(message, serverQueue);
  }

  if (message.content.startsWith("?clear")) {
    music.ClearQueue(message, serverQueue);
  }

  if (!message.content.startsWith("?") && mensagem.content !== "") {
    if (message.author === mensagem.author) {
      music.Execute(message, serverQueue, music.listaVideos);
      mensagem.content = "";
    }
  }

  if (message.content.startsWith("?teste")) {
    message.channel.send(
      `Tô pronto para arrombar! {0} {1}`,
      emoji.get("white_check_mark"),
      emoji.get("dragon_face")
    );
  }

  if (message.content.startsWith("?hltv")) {
    Ranking(message);
  }
  
});

client.login(process.env.DISCORD_TOKEN);
