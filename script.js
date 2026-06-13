import { CONFIG, API_ENDPOINTS, WEATHER_CONDITIONS } from './config.js';

/**
 * Weather Dashboard Application
 */

class WeatherDashboard {
  constructor() {
    this.currentCity = null;
    this.currentWeatherData = null;
    this.forecastData = null;
    this.favorites = this.loadFavorites();
    this.recentSearches = this.loadRecentSearches();
    
    this.initializeElements();
    this.attachEventListeners();
    this.renderFavorites();
    this.renderRecentSearches();
    
    // Load default city on startup
    this.loadWeatherByCity(CONFIG.DEFAULT_CITY);
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.elements = {
      searchInput: document.getElementById('searchInput'),
      searchBtn: document.getElementById('searchBtn'),
      locationBtn: document.getElementById('locationBtn'),
      loadingSpinner: document.getElementById('loadingSpinner'),
      errorMessage: document.getElementById('errorMessage'),
      currentWeather: document.getElementById('currentWeather'),
      forecastSection: document.getElementById('forecastSection'),
      favoritesSection: document.getElementById('favoritesSection'),
      
      // Current weather details
      cityName: document.getElementById('cityName'),
      date: document.getElementById('date'),
      temperature: document.getElementById('temperature'),
      weatherIcon: document.getElementById('weatherIcon'),
      description: document.getElementById('description'),
      feelsLike: document.getElementById('feelsLike'),
      humidity: document.getElementById('humidity'),
      windSpeed: document.getElementById('windSpeed'),
      pressure: document.getElementById('pressure'),
      visibility: document.getElementById('visibility'),
      
      // Forecast and favorites
      forecast: document.getElementById('forecast'),
      favorites: document.getElementById('favorites'),
      favoriteBtn: document.getElementById('favoriteBtn'),
      recentSearches: document.getElementById('recentSearches')
    };
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
    this.elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });
    this.elements.locationBtn.addEventListener('click', () => this.getUserLocation());
    this.elements.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
  }

  /**
   * Handle search action
   */
  handleSearch() {
    const city = this.elements.searchInput.value.trim();
    if (city) {
      this.loadWeatherByCity(city);
      this.elements.searchInput.value = '';
    }
  }

  /**
   * Load weather by city name
   */
  async loadWeatherByCity(city) {
    try {
      this.showLoading(true);
      this.showError(false);

      // Check if API key is configured
      if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Please configure your OpenWeatherMap API key in config.js');
      }

      // Fetch current weather
      const weatherResponse = await fetch(API_ENDPOINTS.CURRENT_WEATHER(city));
      if (!weatherResponse.ok) {
        throw new Error(`City not found: ${city}`);
      }

      this.currentWeatherData = await weatherResponse.ok ? weatherResponse.json() : null;
      this.currentCity = city;

      // Fetch forecast
      const forecastResponse = await fetch(API_ENDPOINTS.FORECAST(city));
      this.forecastData = await forecastResponse.json();

      // Update UI
      this.updateCurrentWeather();
      this.updateForecast();
      this.addToRecentSearches(city);
      this.changeBackgroundTheme(this.currentWeatherData.weather[0].main);

      this.showLoading(false);
    } catch (error) {
      this.showError(true, error.message);
      this.showLoading(false);
      console.error('Error fetching weather:', error);
    }
  }

  /**
   * Load weather by coordinates (geolocation)
   */
  async loadWeatherByCoordinates(lat, lon) {
    try {
      this.showLoading(true);
      this.showError(false);

      const weatherResponse = await fetch(API_ENDPOINTS.COORDINATES(lat, lon));
      this.currentWeatherData = await weatherResponse.json();
      this.currentCity = this.currentWeatherData.name;

      const forecastResponse = await fetch(API_ENDPOINTS.FORECAST_BY_COORDS(lat, lon));
      this.forecastData = await forecastResponse.json();

      this.updateCurrentWeather();
      this.updateForecast();
      this.changeBackgroundTheme(this.currentWeatherData.weather[0].main);

      this.showLoading(false);
    } catch (error) {
      this.showError(true, 'Unable to fetch weather for your location');
      this.showLoading(false);
      console.error('Error fetching weather:', error);
    }
  }

  /**
   * Get user's current location
   */
  getUserLocation() {
    if (navigator.geolocation) {
      this.showLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.loadWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          this.showError(true, 'Unable to access your location. Please enable location services.');
          this.showLoading(false);
          console.error('Geolocation error:', error);
        }
      );
    } else {
      this.showError(true, 'Geolocation is not supported by your browser');
    }
  }

  /**
   * Update current weather display
   */
  updateCurrentWeather() {
    if (!this.currentWeatherData) return;

    const data = this.currentWeatherData;
    const main = data.main;
    const weather = data.weather[0];

    // Update location and date
    this.elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
    this.elements.date.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Update temperature and weather
    this.elements.temperature.textContent = Math.round(main.temp);
    this.elements.weatherIcon.src = this.getWeatherIconUrl(weather.icon);
    this.elements.description.textContent = weather.description;
    this.elements.feelsLike.textContent = `Feels like ${Math.round(main.feels_like)}°C`;

    // Update details
    this.elements.humidity.textContent = `${main.humidity}%`;
    this.elements.windSpeed.textContent = `${data.wind.speed} m/s`;
    this.elements.pressure.textContent = `${main.pressure} hPa`;
    this.elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    // Update favorite button state
    this.updateFavoriteButton();

    // Show current weather section
    this.elements.currentWeather.classList.remove('hidden');
  }

  /**
   * Update forecast display
   */
  updateForecast() {
    if (!this.forecastData) return;

    const forecasts = {};
    
    // Group forecasts by day
    this.forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!forecasts[date]) {
        forecasts[date] = [];
      }
      forecasts[date].push(item);
    });

    // Get one forecast per day
    const dailyForecasts = Object.values(forecasts)
      .slice(0, 5)
      .map(dayForecasts => dayForecasts[Math.floor(dayForecasts.length / 2)]);

    // Render forecast items
    this.elements.forecast.innerHTML = dailyForecasts
      .map(forecast => this.createForecastItem(forecast))
      .join('');

    this.elements.forecastSection.classList.remove('hidden');
  }

  /**
   * Create forecast item HTML
   */
  createForecastItem(forecast) {
    const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const temp = Math.round(forecast.main.temp);
    const tempMin = Math.round(forecast.main.temp_min);
    const tempMax = Math.round(forecast.main.temp_max);
    const description = forecast.weather[0].description;
    const icon = this.getWeatherIconUrl(forecast.weather[0].icon);

    return `
      <div class="forecast-item">
        <div class="forecast-date">${date}</div>
        <div class="forecast-icon">
          <img src="${icon}" alt="${description}">
        </div>
        <div class="forecast-temp">${temp}°C</div>
        <div class="forecast-temp-range">${tempMin}° - ${tempMax}°</div>
        <div class="forecast-description">${description}</div>
      </div>
    `;
  }

  /**
   * Get weather icon URL
   */
  getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  /**
   * Change background theme based on weather
   */
  changeBackgroundTheme(weatherType) {
    document.body.classList.remove('sunny-bg', 'cloudy-bg', 'rainy-bg');
    
    const weatherLower = weatherType.toLowerCase();
    
    if (WEATHER_CONDITIONS.SUNNY.some(type => weatherLower.includes(type))) {
      document.body.classList.add('sunny-bg');
    } else if (WEATHER_CONDITIONS.CLOUDY.some(type => weatherLower.includes(type))) {
      document.body.classList.add('cloudy-bg');
    } else if (WEATHER_CONDITIONS.RAINY.some(type => weatherLower.includes(type))) {
      document.body.classList.add('rainy-bg');
    }
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite() {
    if (!this.currentCity) return;

    const favoriteIndex = this.favorites.findIndex(
      fav => fav.name.toLowerCase() === this.currentCity.toLowerCase()
    );

    if (favoriteIndex > -1) {
      this.favorites.splice(favoriteIndex, 1);
    } else {
      this.favorites.push({
        name: this.currentCity,
        temperature: Math.round(this.currentWeatherData.main.temp),
        weather: this.currentWeatherData.weather[0].main
      });
    }

    this.saveFavorites();
    this.updateFavoriteButton();
    this.renderFavorites();
  }

  /**
   * Update favorite button state
   */
  updateFavoriteButton() {
    const isFavorite = this.favorites.some(
      fav => fav.name.toLowerCase() === this.currentCity.toLowerCase()
    );
    this.elements.favoriteBtn.textContent = isFavorite ? '❤️' : '♡';
    this.elements.favoriteBtn.classList.toggle('active', isFavorite);
  }

  /**
   * Render favorites section
   */
  renderFavorites() {
    if (this.favorites.length === 0) {
      this.elements.favorites.innerHTML = '<div class="empty-message">No saved locations yet</div>';
      return;
    }

    this.elements.favorites.innerHTML = this.favorites
      .map(favorite => this.createFavoriteCard(favorite))
      .join('');

    // Add event listeners to favorite cards
    document.querySelectorAll('.favorite-card').forEach((card, index) => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.remove-favorite')) {
          this.loadWeatherByCity(this.favorites[index].name);
        }
      });

      card.querySelector('.remove-favorite').addEventListener('click', (e) => {
        e.stopPropagation();
        this.favorites.splice(index, 1);
        this.saveFavorites();
        this.renderFavorites();
        this.updateFavoriteButton();
      });
    });
  }

  /**
   * Create favorite card HTML
   */
  createFavoriteCard(favorite) {
    return `
      <div class="favorite-card">
        <button class="remove-favorite" title="Remove from favorites">×</button>
        <div class="favorite-card-name">${favorite.name}</div>
        <div class="favorite-card-temp">${favorite.temperature}°C</div>
        <div class="favorite-card-weather">${favorite.weather}</div>
      </div>
    `;
  }

  /**
   * Add city to recent searches
   */
  addToRecentSearches(city) {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(
      s => s.toLowerCase() !== city.toLowerCase()
    );
    
    // Add to beginning
    this.recentSearches.unshift(city);
    
    // Keep only last 5 searches
    this.recentSearches = this.recentSearches.slice(0, 5);
    
    this.saveRecentSearches();
    this.renderRecentSearches();
  }

  /**
   * Render recent searches
   */
  renderRecentSearches() {
    if (this.recentSearches.length === 0) {
      this.elements.recentSearches.innerHTML = '';
      return;
    }

    this.elements.recentSearches.innerHTML = this.recentSearches
      .map(search => `
        <div class="recent-search-tag" data-city="${search}">
          ${search}
        </div>
      `)
      .join('');

    // Add event listeners
    document.querySelectorAll('.recent-search-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        this.loadWeatherByCity(tag.dataset.city);
      });
    });
  }

  /**
   * Show/hide loading spinner
   */
  showLoading(show) {
    this.elements.loadingSpinner.classList.toggle('hidden', !show);
  }

  /**
   * Show/hide error message
   */
  showError(show, message = '') {
    this.elements.errorMessage.classList.toggle('hidden', !show);
    if (show) {
      this.elements.errorMessage.textContent = message;
    }
  }

  /**
   * Local storage operations
   */
  saveFavorites() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(this.favorites));
  }

  loadFavorites() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  }

  saveRecentSearches() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(this.recentSearches));
  }

  loadRecentSearches() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.RECENT_SEARCHES);
    return saved ? JSON.parse(saved) : [];
  }
}

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new WeatherDashboard();
});