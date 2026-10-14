import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const apiKey = 'ad7d5d3829cde63aed4124dd892a62f7';

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;

    try {
      setError('');
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=ur`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.cod === 200) {
        setWeather(weatherData);
        fetchForecast(city);
      } else {
        setError('شہر کا نام درست نہیں ہے یا ڈیٹا نہیں ملا۔');
        setWeather(null);
        setForecast([]);
      }
    } catch (err) {
      setError('ڈیٹا حاصل کرنے میں خرابی پیش آگئی۔');
    }
  };

  const fetchForecast = async (searchCity) => {
    try {
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=metric&appid=${apiKey}&lang=ur`
      );
      const forecastData = await forecastRes.json();

      if (forecastData.cod === "200") {
        const dailyData = forecastData.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(dailyData);
      }
    } catch (err) {
      console.error('فورکاسٹ لوڈ کرنے میں خرابی:', err);
    }
  };

  return (
    <div className="weather-app-container">
      <h1>لائیو موسمی ایپ</h1>

      <form onSubmit={fetchWeather} className="search-box">
        <input
          type="text"
          placeholder="شہر کا نام لکھیں (جیسے Peshawar)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">تلاش کریں</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name} ({weather.sys.country})</h2>
          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <p className="description">حالت: {weather.weather[0].description}</p>
          
          <div className="details-grid">
            <div>💧 نمی: {weather.main.humidity}%</div>
            <div>💨 ہوا کی رفتار: {weather.wind.speed} m/s</div>
            <div>⏱️ دباؤ: {weather.main.pressure} hPa</div>
            <div>🌡️ محسوس ہوتا ہے: {Math.round(weather.main.feels_like)}°C</div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-section">
          <h3>آئندہ چند دنوں کا موسم</h3>
          <div className="forecast-grid">
            {forecast.map((item, index) => {
              const date = new Date(item.dt * 1000).toLocaleDateString('ur-PK', { weekday: 'short' });
              return (
                <div key={index} className="forecast-item">
                  <p className="forecast-day">{date}</p>
                  <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
                  <p className="forecast-desc">{item.weather[0].description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;