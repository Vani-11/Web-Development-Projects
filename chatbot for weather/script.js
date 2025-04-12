// script.js

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
    // Extract city and date from the user message using simple parsing
    const match = message.match(/weather in (.+) on (\d{4}-\d{2}-\d{2})/i);

    if (match) {
        const city = match[1];
        const date = match[2];
        getWeather(city, date);
    } else if (/yesterday|today|tomorrow/i.test(message)) {
        const city = message.match(/in (.+)/i)?.[1] || 'New York'; // Default city
        let date = new Date();

        if (/yesterday/i.test(message)) {
            date.setDate(date.getDate() - 1);
        } else if (/tomorrow/i.test(message)) {
            date.setDate(date.getDate() + 1);
        }
        getWeather(city, date.toISOString().split('T')[0]);
    } else {
        addMessage("Sorry, I didn't understand that. Please ask for weather in a specific city and date (e.g., 'Weather in London on 2024-09-25').", 'bot');
    }
}

async function getWeather(city, date) {
    try {
        // Construct the API request URL
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod === 200) {
            const weather = data.weather[0].description;
            const temp = (data.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
            const humidity = data.main.humidity;

            addMessage(`Weather in ${city} on ${date}: ${weather}, Temperature: ${temp}°C, Humidity: ${humidity}%`, 'bot');
        } else {
            addMessage(`Could not find weather information for ${city}.`, 'bot');
        }
    } catch (error) {
        addMessage(`An error occurred: ${error.message}`, 'bot');
    }
}
