const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

const { fetchForecast } = require('../requests/forecast');

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
  try {
    await interaction.deferReply();

    const location = interaction.options.getString('location');
    const unit = interaction.options.getString('unit') || 'metric';
    const isMetric = unit === 'metric';

    const { forecast, locationName } = await fetchForecast(location);

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Weather forecast for ${locationName}`)
      .setDescription(`Using the units system: ${unit}`)
      .setTimestamp()
      .setFooter({
        text: 'Powered by weatherapi.com',
      });

    forecast.forEach((day) => {
      const {
        date,
        temperatureMaxC,
        temperatureMinC,
        temperatureMinF,
        temperatureMaxF,
        avgTemp,
        condition,
        icon,
      } = day;

      const temperatureMax = isMetric ? temperatureMaxC : temperatureMaxF;
      const temperatureMin = isMetric ? temperatureMinC : temperatureMinF;

      embed.addFields({
        name: date,
        value: `🌡️ ${temperatureMin}° - ${temperatureMax}°\n🌤️ ${condition}`,
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
