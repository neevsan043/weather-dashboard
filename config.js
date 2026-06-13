/**
 * Weather Dashboard Configuration
 * 
 * To use this application:
 * 1. Get a free API key from https://openweathermap.org/api
 * 2. Replace 'YOUR_API_KEY_HERE' with your actual API key
 */

export const CONFIG = {
  // OpenWeatherMap API Key - Get yours for free at https://openweathermap.org/api
  API_KEY: 'YOUR_API_KEY_HERE',
  
  // API Base URL
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  
  // Units: 'metric' for Celsius, 'imperial' for Fahrenheit
  UNITS: 'metric',
  
  // Default city on load
  DEFAULT_CITY: 'London',
  
  // Auto-refresh interval in milliseconds (10 minutes)
  REFRESH_INTERVAL: 10 * 60 * 1000,
  
  // Forecast days to display
  FORECAST_DAYS: 5,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    FAVORITES: 'weather_favorites',
    RECENT_SEARCHES: 'weather_recent_searches',
    LAST_SEARCH: 'weather_last_search'
  }
};

/**
 * Weather condition mapping for background styling
 */
export const WEATHER_CONDITIONS = {
  SUNNY: ['clear'],
  CLOUDY: ['clouds', 'overcast'],
  RAINY: ['rain', 'drizzle', 'thunderstorm'],
  SNOWY: ['snow']
};

/**
 * API Endpoints Helper
 */
export const API_ENDPOINTS = {
  CURRENT_WEATHER: (city) => 
    `${CONFIG.API_BASE_URL}/weather?q=${city}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`,
  
  FORECAST: (city) => 
    `${CONFIG.API_BASE_URL}/forecast?q=${city}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`,
  
  COORDINATES: (lat, lon) => 
    `${CONFIG.API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`,
  
  FORECAST_BY_COORDS: (lat, lon) => 
    `${CONFIG.API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`
};