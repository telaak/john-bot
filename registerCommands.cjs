const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

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
  ""
);

rest
  .put(
    Routes.applicationGuildCommands("", ""),
    { body: commands }
  )
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
