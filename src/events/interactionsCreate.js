const logger = require('../utils/logger');

async function interactionCreateHandler(interaction) {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);

    logger.debug(`Command ${interaction.commandName} executed by ${interaction.user.tag}`);
  } catch (error) {
    logger.error(error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
}

module.exports = {
  interactionCreateHandler,
};
