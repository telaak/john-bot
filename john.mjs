import { exec } from "child_process";
import { promisify } from "util";
import { unlinkSync, readdirSync } from "fs";

import { writeFileSync } from "fs";

import canvasPackage from "canvas";
const { createCanvas, loadImage } = canvasPackage;

const asyncExec = promisify(exec);

const getRandomJohn = async (file, outputFile) => {
  const videoProbe = await asyncExec(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`
  );
  const videoLength = String(videoProbe.stdout).trim();
  const randomFrame = await asyncExec(
    `ffmpeg -ss ${getRandomIntInclusive(
      1,
      videoLength
    )} -i "${file}" -frames:v 1 ${outputFile}`
  );
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

import { Client, Intents } from "discord.js";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const getRandomJohnVideo = () => {
  const files = readdirSync("./").filter(
    (f) => f.endsWith(".webm") || f.endsWith(".mp4")
  );
  const randomVideo = files[getRandomIntInclusive(0, files.length)];
  return randomVideo;
};

let timeSent = new Date();

client.once("ready", () => {
  // const channel = client.channels.cache.get('916713428918349827');

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (
      message.content.toLowerCase() === "john" &&
      timeSent < new Date() - 1000
    ) {
      timeSent = new Date();
      const nonce = new Date().getTime();
      await getRandomJohn(`./${getRandomJohnVideo()}`, `${nonce}.jpg`);
      await message.channel.send({
        files: [
          {
            attachment: `${nonce}.jpg`,
            name: "john.jpg",
          },
        ],
      });
      unlinkSync(`${nonce}.jpg`);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "john") {
      await interaction.reply("sike");
    }
  });
});

client.login("");
