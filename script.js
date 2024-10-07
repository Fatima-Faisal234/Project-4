// Initial state object to mimic Redux-like state
let state = {
  weatherData: [],
  currentPage: 1,
  query: '',
  darkMode: false
};

// Utility function to fetch weather data (mock API)
const fetchWeatherData = async (page = 1, query = '') => {
  // Simulating a weather API call with pagination and search query
  const response = await fetch(`https://api.example.com/weather?page=${page}&query=${query}`);
  const data = await response.json();
  return data;
};

// Render weather data to the DOM
const renderWeather = (weatherData) => {
  const weatherList = document.getElementById('weatherList');
  weatherData.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'weather-item';
    div.innerHTML = `<h3>${item.name}</h3><p>Temperature: ${item.temperature}°C</p>`;
    weatherList.appendChild(div);
  });
};

// Debounced search
let debounceTimer;
const debounceSearch = (callback, delay) => {
  return function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => callback.apply(this, arguments), delay);
  };
};

// Event: Handle search input changes with debouncing
document.getElementById('searchInput').addEventListener('input', debounceSearch(async (e) => {
  const query = e.target.value;
  state.query = query;
  state.currentPage = 1;  // Reset to first page for a new search

  // Clear previous weather data
  document.getElementById('weatherList').innerHTML = '';

  const weatherData = await fetchWeatherData(state.currentPage, query);
  state.weatherData = weatherData;
  renderWeather(state.weatherData);
}, 300));

// Event: Load more weather data (pagination)
document.getElementById('loadMoreBtn').addEventListener('click', async () => {
  state.currentPage += 1;

  const weatherData = await fetchWeatherData(state.currentPage, state.query);
  state.weatherData = [...state.weatherData, ...weatherData];  // Append new data to existing state
  renderWeather(weatherData);
});

// Dark mode toggle
const toggleTheme = () => {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('dark-mode', state.darkMode);
};

document.getElementById('toggleTheme').addEventListener('click', toggleTheme);

// Initial fetch for weather data
(async () => {
  const weatherData = await fetchWeatherData();
  state.weatherData = weatherData;
  renderWeather(state.weatherData);
})();
