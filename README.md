# Weather Dashboard

A beautiful, responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API.

## Features

- 🌤️ Real-time weather data
- 📍 Search weather by city name
- 🌡️ Display current temperature, humidity, and wind speed
- ⛅ 5-day weather forecast
- 🎨 Beautiful UI with gradient backgrounds
- 📱 Fully responsive design
- 🔄 Auto-refresh weather data
- 💾 Save favorite locations (localStorage)

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenWeatherMap Free API
- **Architecture**: Vanilla JavaScript (No frameworks)

## Setup Instructions

### 1. Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate a free API key
4. Copy your API key

### 2. Configure the Application

Create a `config.js` file in the project root:

```javascript
export const CONFIG = {
  API_KEY: 'your_api_key_here',
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5'
};
```

### 3. Run the Application

Since this uses ES6 modules, you need to run it on a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (http-server)
npx http-server
```

Then open your browser and navigate to `http://localhost:8000`

## Usage

1. **Search by City**: Enter a city name in the search box and press Enter or click Search
2. **View Details**: See current weather conditions, temperature, humidity, and wind speed
3. **View Forecast**: Check the 5-day weather forecast below
4. **Save Favorites**: Click the heart icon to save your favorite locations
5. **View Saved**: Access your saved locations from the favorites section

## API Endpoints Used

- **Current Weather**: `GET /weather?q={city}&appid={API_KEY}&units=metric`
- **Forecast**: `GET /forecast?q={city}&appid={API_KEY}&units=metric`

## Project Structure

- `index.html` - Main HTML structure
- `style.css` - Styling and animations
- `script.js` - Main application logic
- `config.js` - Configuration and API settings

## Features Breakdown

### Current Weather Display
- City name and country
- Current temperature
- Weather description
- "Feels like" temperature
- Humidity percentage
- Wind speed
- UV index (if available)

### 5-Day Forecast
- Daily weather predictions
- Min/max temperatures
- Weather icons
- Precipitation chance

### User Experience
- Geolocation support (optional)
- Recent searches history
- Favorites management
- Error handling and notifications
- Loading states

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Future Enhancements

- [ ] Add multiple language support
- [ ] Implement dark mode
- [ ] Add hourly forecast
- [ ] Integrate weather alerts
- [ ] Add air quality index (AQI)
- [ ] Backend integration with database
- [ ] Mobile app version

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.

## Support

For issues or questions, please open an issue on GitHub.