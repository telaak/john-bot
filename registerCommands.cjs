const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require('dotenv').config()

const commands = [
  new SlashCommandBuilder()
    .setName("john")
    .setDescription("Get random john")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text on the bottom")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(
  process.env.TOKEN
);

rest
  .put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  )
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
