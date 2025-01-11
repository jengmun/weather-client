import { useEffect, useState } from "react";
import "./App.css";
import { fetchWeather, getCoordinates, WeatherData } from "./utils/utils";

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchHistory, setSearchHistory] = useState<
    { country: string; city: string; searchTime: number }[]
  >([]);

  useEffect(() => {
    const initialiseWeather = async () => {
      // Default to Singapore's coordinates
      let lat = 1.3521;
      let lon = 103.8198;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        },
        () => {
          console.error("Unable to retrieve location");
        }
      );

      const currentWeather = await fetchWeather({
        lat,
        lon,
      });

      if (currentWeather) {
        setWeather(currentWeather);
      }
    };
    initialiseWeather();
  }, []);

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchInput = formData.get("search")?.toString();

    if (!searchInput) {
      console.error("Please input city and country code");
      return;
    }
    const searchCity = searchInput.split(",")?.[0]?.trim();
    if (!searchCity) {
      console.error("Please input city");
      return;
    }
    const searchCountry = searchInput.split(",")?.[1]?.trim();
    if (!searchCountry) {
      console.error("Please input country code");
      return;
    }
    const results: {
      country: string;
      name: string;
      lat: number;
      lon: number;
    }[] = await getCoordinates({ city: searchCity, country: searchCountry });

    if (!results.length) {
      console.error("City and Country are invalid");
      return;
    }

    const currentWeather: WeatherData = await fetchWeather({
      lat: results[0].lat,
      lon: results[0].lon,
    });

    if (currentWeather) {
      setWeather(currentWeather);
    }

    setSearchHistory((prev) => {
      return [
        {
          country: searchCountry,
          city: searchCity,
          searchTime: new Date().valueOf(),
        },
        ...prev.filter(({ country, city }) => {
          return country !== searchCountry && city !== searchCity;
        }),
      ];
    });
  };

  return (
    <div>
      Today's Weather
      <form onSubmit={onSearch}>
        <input name="search" />
        <button type="submit">Search</button>
      </form>
      {weather && (
        <>
          {weather.name}, {weather.sys.country}
          {weather.weather[0].main}
          {weather.weather[0].description}
          {weather.main.humidity}%{(weather.main.temp_min - 273.15).toFixed(2)}{" "}
          - {(weather.main.temp_max - 273.15).toFixed(2)}
          {new Date(new Date().valueOf() + weather.timezone).toUTCString()}
        </>
      )}
      Search History
      {searchHistory.map((search) => {
        return (
          <div key={`${search.city}, ${search.country}`}>
            {search.city}, {search.country}
            {new Date(search.searchTime).toUTCString()}
            <button>
              <img src="/search.png" alt="search" />
            </button>
            <button>
              <img src="/bin.png" alt="search" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;

// Assumptions:
// 1. Search based on city u are in
// 2. Remove old search history if same city
// 3. User allowed to select search results
// 4. Use new api w geolocation rather than deprecated API

// Todo:
// Deployment
// Cache
