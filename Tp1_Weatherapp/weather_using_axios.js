const axios = require('axios').default;

API_KEY = "38f9264b8e345e5059d64b5e08c19663";
BASE_URL = "http://api.openweathermap.org/data/2.5/weather?appid=" + API_KEY + "&units=metric&lang=fr&q=";


async function getWeatherData(city) {
    try {
        const response = await axios.get(BASE_URL + city);
        const data = response.data;
        displayWeather(data);
    }
    catch (error) {
        console.error(error.message);
    }
}

function displayWeather(weatherData) {
    console.log("Ville :", weatherData.name);
    console.log("Description :", weatherData.weather[0].description);
    console.log("Température :", weatherData.main.temp + "°C");
    console.log("Humidité :", weatherData.main.humidity + "%");
}

getWeatherData("Sousse");