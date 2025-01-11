import { useEffect, useState } from "react";
import "./App.css";
import { fetchWeather, getCoordinates, WeatherData } from "./utils/utils";

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchHistory, setSearchHistory] = useState<
    {
      id: number;
      country: string;
      city: string;
      lat: number;
      lon: number;
      searchTime: number;
    }[]
  >([]);
  const [errorMsg, setErrorMsg] = useState("");

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

  const updateWeather = async ({ lat, lon }: { lat: number; lon: number }) => {
    const currentWeather: WeatherData = await fetchWeather({
      lat: lat,
      lon: lon,
    });

    if (currentWeather) {
      setWeather(currentWeather);
    }

    setSearchHistory((prev) => {
      return [
        {
          id: currentWeather.id,
          country: currentWeather.sys.country,
          city: currentWeather.name,
          lat: lat,
          lon: lon,
          searchTime: new Date().valueOf(),
        },
        ...prev.filter(({ id }) => {
          return id !== currentWeather.id;
        }),
      ];
    });

    if (errorMsg) {
      setErrorMsg("");
    }
  };

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchInput = formData.get("search")?.toString();

    if (!searchInput) {
      console.error("Please input city and country code");
      setErrorMsg("Please input city and country code");
      return;
    }
    const searchCity = searchInput.split(",")?.[0]?.trim();
    if (!searchCity) {
      console.error("Please input city");
      setErrorMsg("Please input city");
      return;
    }
    const searchCountry = searchInput.split(",")?.[1]?.trim();
    if (!searchCountry) {
      console.error("Please input country code");
      setErrorMsg("Please input country code");
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
      setErrorMsg("City and Country are invalid");
      return;
    }

    updateWeather({
      lat: results[0].lat,
      lon: results[0].lon,
    });
  };

  const onDelete = (selectedId: number) => {
    setSearchHistory((prev) => {
      return prev.filter(({ id }) => {
        return selectedId !== id;
      });
    });
  };

  return (
    <div>
      Today's Weather
      <form onSubmit={onSearch}>
        <input name="search" placeholder="Singapore, SG" />
        <button type="submit">
          <img src="/search.png" alt="search" />
        </button>
      </form>
      {errorMsg}
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
            <button
              onClick={() => {
                updateWeather({ lat: search.lat, lon: search.lon });
              }}
            >
              <img src="/search.png" alt="search" />
            </button>
            <button
              onClick={() => {
                onDelete(search.id);
              }}
            >
              <img src="/bin.png" alt="delete" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
