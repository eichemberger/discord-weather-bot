const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('forecast')
  .setDescription('Replies with the weather forecast for the given location')
  .addStringOption((option) => {
    option.setName('location')
      .setDescription('The location to check the weather for')
      .setRequired(true);

    return option;
  })
  .addStringOption((option) => {
    option.setName('unit')
      .setDescription('The unit to use for the temperature: eithcer Celsius or Fahrenheit')
      .setRequired(false)
      .addChoices(
        {
          name: 'Metric',
          value: 'metric',
        },
        {
          name: 'Imperial',
          value: 'imperial',
        },
      );

    return option;
  });

async function execute(interaction) {
  const location = interaction.options.getString('location');
  const unit = interaction.options.getString('unit') || 'metric';

  await interaction.reply('The weather is great!');
}

module.exports = {
  data,
  execute,
};
