const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

const { fetchForecast } = require('../requests/forecast');

const data = new SlashCommandBuilder()
  .setName('astro')
  .setDescription('Replies with the astro forecast for the given location')
  .addStringOption((option) => {
    option.setName('location')
      .setDescription('The location to check the weather for')
      .setRequired(true);

    return option;
  });

async function execute(interaction) {
  try {
    await interaction.deferReply();

    const location = interaction.options.getString('location');

    const { forecast, locationName } = await fetchForecast(location);

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Astronomical forecast for ${locationName}`)
      .setTimestamp()
      .setFooter({
        text: 'Powered by weatherapi.com',
      });

    forecast.forEach((day) => {
      embed.addFields({
        name: day.date,
        value: `🌄 Sunrise: ${day.sunrise}\n🌇Sunset: ${day.sunset}\n🌔Moonrise: ${day.moonrise}\n🌒Moonset: ${day.moonset}`,
      });
    });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    await interaction.editReply('Failed to fetch forecast :(');
  }
}

module.exports = {
  data,
  execute,
};
