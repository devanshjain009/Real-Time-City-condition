import React, { useEffect, useState } from "react";

// A simple component to show a loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
  </div>
);

// A component to display error messages
const ErrorMessage = ({ message }) => (
  <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
    <p className="font-bold">Error</p>
    <p>{message}</p>
  </div>
);

// The main component to display the weather card
const WeatherCard = ({ data }) => {
  // Construct the URL for the weather icon from OpenWeatherMap
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-lg text-white animate-fade-in">
      {/* Location and Date */}
      <div>
        <h2 className="text-4xl font-bold">
          {data.name}, {data.sys?.country}
        </h2>
        <p className="text-lg">
          {new Date().toLocaleString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Temperature and Icon */}
      <div className="my-6 flex justify-center items-center">
        <p className="text-8xl font-extrabold">
          {Math.round(data.main?.temp)}°C
        </p>
        <img
          src={iconUrl}
          alt={data.weather[0].description}
          className="w-24 h-24"
        />
      </div>

      {/* Weather Description */}
      <div className="text-center mb-6">
        <p className="text-2xl capitalize font-semibold">
          {data.weather[0].description}
        </p>
      </div>

      {/* Additional Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="bg-white/20 p-3 rounded-lg">
          <p className="font-semibold">Feels Like</p>
          <p className="text-xl">{Math.round(data.main?.feels_like)}°C</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <p className="font-semibold">Humidity</p>
          <p className="text-xl">{data.main?.humidity}%</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <p className="font-semibold">Wind Speed</p>
          <p className="text-xl">{data.wind?.speed} m/s</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <p className="font-semibold">Pressure</p>
          <p className="text-xl">{data.main?.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Kanpur"); // The city to fetch data for
  const [searchInput, setSearchInput] = useState("Kanpur"); // The user's input
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    async function getWeather() {
      // Reset state for a new fetch
      setLoading(true);
      setError(null);

      try {
        // In a Vite project, environment variables are accessed via `import.meta.env`
        // and must be prefixed with VITE_. Create a .env file in your project root.
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        if (!apiKey) {
          throw new Error(
            "API key not found. Please add it to your .env file."
          );
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        // --- THIS IS THE CRITICAL FIX ---
        // If the response is not OK (e.g., 404 Not Found), throw an error
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Could not fetch weather data.");
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
        setWeatherData(null); // Clear any old data
      } finally {
        setLoading(false);
      }
    }

    getWeather();
  }, [city]); // This effect re-runs ONLY when the 'city' state changes

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    setCity(searchInput);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-blue-900 to-purple-900 font-sans">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Weather Dashboard
        </h1>

        {/* Search form is always visible */}
        <form onSubmit={handleSearch} className="flex mb-8 shadow-lg">
          <input
            type="text"
            className="w-full p-3 rounded-l-md text-white focus:outline-none"
            placeholder="Enter city name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-r-md transition-colors"
          >
            Search
          </button>
        </form>

        {/* Conditional Rendering Logic is now much cleaner */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {weatherData && <WeatherCard data={weatherData} />}
      </div>
    </div>
  );
};

export default App;
