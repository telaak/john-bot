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
  return Math.floor(Math.random() * (max - min + 1) + min);
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

client.once("ready", () => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "john") {
      const bottomText = interaction.options.getString("text");
      const nonce = new Date().getTime();
      await getRandomJohn(`./${getRandomJohnVideo()}`, `${nonce}.jpg`);
      const johnImage = await loadImage(`${nonce}.jpg`);
      const canvasBuffer = createJohnImageText(johnImage, bottomText || "");
      writeFileSync(`${nonce}-text.jpg`, canvasBuffer);
      await interaction.reply({
        files: [
          {
            attachment: `${nonce}-text.jpg`,
            name: "john.jpg",
          },
        ],
      });
      unlinkSync(`${nonce}.jpg`);
      unlinkSync(`${nonce}-text.jpg`);
    }
  });
});

client.login("");

const createJohnImageText = (image, text) => {
  const width = image.width;
  const height = image.height;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.font = "1px Sans";
  const maxWidth = image.width / context.measureText(text).width;
  context.drawImage(image, 0, 0, image.width, image.height);
  context.font = `${maxWidth}px Sans`;
  context.textBaseline = "bottom";
  context.textAlign = "center";
  context.strokeStyle = "black";
  context.lineWidth = 8;
  context.strokeText(text, image.width / 2, image.height);
  context.fillStyle = "white";
  context.fillText(text, image.width / 2, image.height);
  const buffer = canvas.toBuffer("image/png");
  return buffer;
};
