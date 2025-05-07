// OpenWeatherMap API key
const API_KEY = 'abf8385654503e4c5fc432e28b822729';

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    document.getElementById('user-input').value = '';
    addMessage(userInput, 'user');

    processUserMessage(userInput);
}

function addMessage(text, type) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + type;
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function processUserMessage(message) {
    const match = message.match(/weather in (.+) on (\d{4}-\d{2}-\d{2})/i);

    if (match) {
        const city = match[1];
        const date = match[2];
        getWeather(city, date);
    } else if (/forecast for the next (\d+) days/i.test(message)) {
        const city = message.match(/for (.+) next/i)?.[1] || 'New York'; // Default city
        const days = parseInt(message.match(/(\d+)/)[1]);
        getForecast(city, days);
    } else if (/multiple cities (.+)/i.test(message)) {
        const cities = message.match(/multiple cities (.+)/i)[1].split(',').map(city => city.trim());
        getWeatherForMultipleCities(cities);
    } else if (/sunrise and sunset/i.test(message)) {
        const city = message.match(/in (.+)/i)?.[1] || 'New York'; // Default city
        getSunriseSunset(city);
    } else if (/alert me/i.test(message)) {
        setWeatherAlert(message);
    } else if (/share weather/i.test(message)) {
        shareWeatherReport();
    } else {
        addMessage("Sorry, I didn't understand that. Please ask for weather in a specific city and date (e.g., 'Weather in London on 2024-09-25').", 'bot');
    }
}

async function getWeather(city, date) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod === 200) {
            const weather = data.weather[0].description;
            const icon = getWeatherIcon(data.weather[0].icon);
            const temp = (data.main.temp - 273.15).toFixed(1);
            const humidity = data.main.humidity;
            const uvIndex = data.current.uvi || 'N/A';
            const airQualityIndex = data.list[0].main.aqi;

            addMessage(`Weather in ${city} on ${date}: ${icon} ${weather}, Temperature: ${temp}°C, Humidity: ${humidity}%`, 'bot');
            displayWeatherAlerts(temp, humidity, weather, uvIndex, airQualityIndex);
        } else {
            addMessage(`Could not find weather information for ${city}.`, 'bot');
        }
    } catch (error) {
        addMessage(`An error occurred: ${error.message}`, 'bot');
    }
}

// Get weather for multiple cities
async function getWeatherForMultipleCities(cities) {
    try {
        const weatherReports = [];
        for (let city of cities) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod === 200) {
                const weather = data.weather[0].description;
                const icon = getWeatherIcon(data.weather[0].icon);
                const temp = (data.main.temp - 273.15).toFixed(1);

                weatherReports.push(`${city}: ${icon} ${weather}, Temp: ${temp}°C`);
            } else {
                weatherReports.push(`Could not find weather information for ${city}.`);
            }
        }

        addMessage(weatherReports.join('\n'), 'bot');
    } catch (error) {
        addMessage(`An error occurred: ${error.message}`, 'bot');
    }
}

// Get Sunrise and Sunset times
async function getSunriseSunset(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod === 200) {
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            addMessage(`Sunrise in ${city}: ${sunrise}, Sunset: ${sunset}`, 'bot');
        } else {
            addMessage(`Could not find sunrise and sunset times for ${city}.`, 'bot');
        }
    } catch (error) {
        addMessage(`An error occurred: ${error.message}`, 'bot');
    }
}

// Set weather alerts (for specific cities)
function setWeatherAlert(message) {
    const alertMessage = message.match(/alert me if the temperature in (.+) goes above (\d+)°C/i);

    if (alertMessage) {
        const city = alertMessage[1];
        const temp = alertMessage[2];
        addMessage(`Weather alert set for ${city} if the temperature goes above ${temp}°C. I’ll notify you when it happens!`, 'bot');
    } else {
        addMessage('Please specify the city and the temperature threshold for the alert (e.g., "Alert me if the temperature in London goes above 30°C").', 'bot');
    }
}

// Share the weather report
function shareWeatherReport() {
    const url = window.location.href;
    const text = "Check out the current weather: " + url;
    addMessage("Share this weather report: " + text, 'bot');
}

function getWeatherIcon(iconCode) {
    const icons = {
        "01d": "☀️", "01n": "🌑",
        "02d": "🌤️", "02n": "🌥️",
        "03d": "🌥️", "03n": "🌥️",
        "04d": "☁️", "04n": "☁️",
        "09d": "🌧️", "09n": "🌧️",
        "10d": "🌦️", "10n": "🌦️",
        "11d": "⛈️", "11n": "⛈️",
        "13d": "❄️", "13n": "❄️",
        "50d": "🌫️", "50n": "🌫️"
    };
    return icons[iconCode] || "🌍";
}

function displayWeatherAlerts(temp, humidity, weather, uvIndex, airQualityIndex) {
    let tips = '';

    // Temperature-based tips
    if (parseFloat(temp) >= 35) {
        tips += "🌡️ Heat Alert: Stay hydrated and avoid prolonged sun exposure.\n";
    }
    if (weather.toLowerCase().includes('rain')) {
        tips += "☔ Rain Alert: Take an umbrella and wear waterproof shoes.\n";
    }
    if (humidity >= 80) {
        tips += "💧 High Humidity: Wear breathable clothing to stay comfortable.\n";
    }
    if (parseFloat(uvIndex) > 7) {
        tips += "☀️ High UV Index: Wear sunscreen, sunglasses, and protective clothing.\n";
    }

    // Air Quality-based tips
    if (airQualityIndex === 5) {
        tips += "💨 Air Quality is Very Poor: Stay indoors, especially if you have respiratory conditions.\n";
    }

    if (tips) {
        addMessage(tips.trim(), 'bot');
    }
}
