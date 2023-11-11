require('dotenv').config();
const logger = require("../utils/logger");
const {
  REST,
  Routes,
} = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
async function clientReadyHandler(client) {
  logger.info(`Logged in as ${client.user.tag}!`);

  try {
    logger.info(`Started refreshing ${client.commands.size} commands...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      {
        body: client.commands.map(command => command.data.toJSON()),
      },
    );

    logger.info(`Successfully reloaded application (/) commands. ${data.length} commands loaded.`);
  } catch (error) {
    logger.error(error);
  }

}

module.exports = {
  clientReadyHandler,
};