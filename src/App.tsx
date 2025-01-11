import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { CircleAlert, Moon, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWeather, getCoordinates, WeatherData } from "./utils/utils";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchInput, setSearchInput] = useState("");
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
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

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

  const handleClear = () => {
    if (errorMsg) {
      setErrorMsg("");
    }
    if (searchInput) {
      setSearchInput("");
    }
  };

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

    handleClear();
  };

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchInput) {
      setErrorMsg("Please input city and country code");
      return;
    }
    const searchCity = searchInput.split(",")?.[0]?.trim();
    if (!searchCity) {
      setErrorMsg("Please input city");
      return;
    }
    const searchCountry = searchInput.split(",")?.[1]?.trim();
    if (!searchCountry) {
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
    <div
      className="bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')] min-h-screen flex flex-col items-center p-4 gap-2"
      aria-label="Today's Weather"
    >
      <Toggle
        onClick={() => {
          setIsDarkMode((prev) => !prev);
        }}
        className="bg-primary hover:bg-accent dark:hover:bg-primary self-start"
        aria-hidden="true"
      >
        <Moon color="white" />
      </Toggle>

      {/* Breakpoint for sm size is 640px */}
      <div className="w-full md:min-w-[640px] md:w-2/5">
        <form onSubmit={onSearch} className="flex flex-row gap-2">
          <Input
            name="search"
            placeholder="Enter City, Country Code (E.g. Singapore, SG)"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            className="bg-secondary/20 text-secondary-foreground dark:bg-background/50 border-none h-10"
          />
          <button type="submit" className="rounded-xl bg-primary w-10 h-10 p-2">
            <Search aria-label="Search" color="white" />
          </button>
        </form>
        {errorMsg && (
          <div className="bg-destructive/90 w-fit p-2 rounded-lg flex gap-2">
            <CircleAlert color="white" />
            <p className="text-destructive-foreground">{errorMsg}</p>
          </div>
        )}

        <div className="bg-secondary/20 dark:bg-background/30 dark:border-none rounded-3xl p-8 mt-12 flex flex-col relative">
          <p className="text-secondary-foreground">Today's Weather</p>
          {/* 800: Clear Sky, 801: Few Clouds */}
          {weather?.weather[0].id === 800 || weather?.weather[0].id === 801 ? (
            <img
              src="/sun.png"
              className="absolute w-52 top-0 right-0"
              alt="sun"
            />
          ) : (
            <img
              src="/cloud.png"
              className="absolute w-52 top-0 right-0"
              alt="cloud"
            />
          )}

          {weather && (
            <>
              <p className="text-primary dark:text-primary-foreground text-8xl font-bold">
                {/* Convert to Celcius */}
                {(weather.main.temp - 273.15).toFixed(0)}&#176;
              </p>
              <p className="text-secondary-foreground">
                H: {(weather.main.temp_max - 273.15).toFixed(0)}&#176; L:{" "}
                {(weather.main.temp_min - 273.15).toFixed(0)}&#176;
              </p>
              <p className="font-semibold">
                {weather.name}, {weather.sys.country}
              </p>

              <div className="flex flex-row justify-between gap-4 grow">
                <p>
                  {new Date(
                    new Date().valueOf() + weather.timezone
                  ).toLocaleString()}
                </p>
                <p>{weather.weather[0].main}</p>
                <p>Humidity: {weather.main.humidity}%</p>
              </div>
            </>
          )}
          <div className="bg-background/30 dark:bg-background/30 rounded-3xl p-4 mt-4 flex flex-col gap-4">
            <p className="p-2 text-secondary-foreground">Search History</p>
            {searchHistory.map((search) => {
              return (
                <div
                  key={`${search.city}, ${search.country}`}
                  className="bg-background/40 dark:bg-background/50 text-secondary-foreground flex flex-row rounded-xl p-2 w-full items-center gap-2"
                >
                  <div className="flex flex-col md:flex-row md:justify-between grow">
                    <p>
                      {search.city}, {search.country}
                    </p>
                    <p>{new Date(search.searchTime).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={() => {
                        updateWeather({ lat: search.lat, lon: search.lon });
                      }}
                      className="bg-background dark:bg-transparent dark:border rounded-full p-2 w-10 h-10 flex justify-center items-center"
                      aria-label="Search"
                    >
                      <Search
                        aria-label="Search"
                        className="text-muted-foreground dark:text-primary-foreground"
                      />
                    </button>
                    <button
                      onClick={() => {
                        onDelete(search.id);
                      }}
                      className="bg-background dark:bg-transparent dark:border rounded-full p-2 w-10 h-10 flex justify-center items-center"
                      aria-label="Delete"
                    >
                      <Trash2
                        aria-label="Delete"
                        className="text-muted-foreground dark:text-primary-foreground"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
