import { v4 as uuidv4 } from "uuid";
import { unlink } from "fs/promises";
import "dotenv/config";
import { Client, Intents } from "discord.js";
import {
  getRandomJohnVideo,
  durationProbe,
  writeSubsFile,
  getRandomFrame,
} from "./ffprobe";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === "john") {
      const bottomText = interaction.options.getString("text") as string
      const id = uuidv4();
      const file = getRandomJohnVideo();
      const [videoLength] = await Promise.all([
        durationProbe(`./videos/${file}`),
        writeSubsFile(bottomText, id),
      ]);
      const imageFile = await getRandomFrame(videoLength, file, id);
      await unlink(`${id}.srt`);
      await interaction.reply({
        files: [
          {
            attachment: imageFile,
            name: "john.jpg",
          },
        ],
      });
    }
  });
});

client.login(process.env.TOKEN);
