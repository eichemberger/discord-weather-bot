require('dotenv').config();
const axios = require('axios');
const logger = require('../utils/logger');

const URL = 'https://api.weatherapi.com/v1/forecast.json';
const FORECAST_DAYS = 3;

async function fetchForecast(location) {
  try {
    const response = await axios({
      url: URL,
      method: 'get',
      params: {
        q: location,
        days: FORECAST_DAYS,
        key: process.env.WEATHER_API_KEY,
      },
      responseType: 'json',
    });

    const city = response.data.location.name;
    const { country } = response.data.location;
    const locationName = `${city}, ${country}`;

    const forecast = response.data.forecast.forecastday.map((day) => {
      const { date } = day;

      const temperatureMaxC = day.day.maxtemp_c;
      const temperatureMinC = day.day.mintemp_c;

      const temperatureMinF = day.day.mintemp_f;
      const temperatureMaxF = day.day.maxtemp_f;

      const avgTemp = day.day.avgtemp_c;
      const condition = day.day.condition.text;
      const { icon } = day.day.condition;

      return {
        date,
        temperatureMaxC,
        temperatureMinC,
        temperatureMinF,
        temperatureMaxF,
        avgTemp,
        condition,
        icon,
      };
    });

    return {
      locationName,
      forecast,
    };
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to fetch forecast :(');
  }
}

module.exports = {
  fetchForecast,
};
