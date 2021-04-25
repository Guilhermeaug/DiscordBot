import Discord from "discord.js";
import emoji from "node-emoji";
import dotenv from "dotenv";
import { Ranking } from "./Hltv/hltvLeaderBoard.js";
import {
  addMusicRequest,
  skipSong,
  searchByKeyword,
  playWithSearchParams,
  showQueue
} from "./Music/music.js";
import { helpMenu} from './Utils/embededTemplates.js';

dotenv.config();

const client = new Discord.Client();
let songRequestMessage = new Discord.Message();

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
  "Planta de defunto",
  "Pelo laudo da perícia esse toma linguiça",
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

client.on("message", (message) => {
  if (message.author.bot) return;
  //if (!message.content.startsWith("?")) return;

  // const serverQueue = music.queue.get(message.guild.id);

  const content = message.content.split(" ")[0].substr(1); // gets the command name

  if (content !== "") {
    peopleMessages.forEach((el) => {
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
    addMusicRequest(message);
  }

  if (message.content.startsWith("?queue")) {
    showQueue(message);
  }

  if (message.content.startsWith("?clean")) {
    music.CleanQueue(message, serverQueue);
  }

  if (message.content.startsWith("?skip")) {
    skipSong(message);
  }

  if (message.content.startsWith("?volume")) {
    music.ChangeVolume(message, serverQueue);
  }

  if (message.content.startsWith("?search")) {
    songRequestMessage = message;
    //music.Arromba(message, serverQueue);
    searchByKeyword(message);
  }

  if (message.content.startsWith("?clear")) {
    music.ClearQueue(message, serverQueue);
  }

  if (!message.content.startsWith("?")) {
    if (message.author === songRequestMessage.author) {
      playWithSearchParams(message);
      songRequestMessage.content = "";
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

  if (message.content === "?help") {
    helpMenu(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
