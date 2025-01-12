import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.openweathermap.org",
});

export interface WeatherData {
  id: number;
  coord: { lat: number; lon: number };
  weather: { id: number; main: string }[];
  main: { humidity: number; temp: number; temp_min: number; temp_max: number };
  sys: { country: string };
  timezone: number;
  name: string;
  dateTime: number;
}

export const fetchWeather = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<WeatherData | null> => {
  try {
    const res = await api.get(
      `/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${
        import.meta.env.VITE_API_KEY
      }`
    );
    return { ...res.data, dateTime: new Date().valueOf() };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCoordinates = async ({
  city,
  country,
}: {
  city: string;
  country: string;
}) => {
  try {
    const res = await api.get(
      `/geo/1.0/direct?q=${city},${country}&appid=${
        import.meta.env.VITE_API_KEY
      }`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        resolve({ lat, lon });
      },
      (error) => {
        console.error("Unable to retrieve location", error);
        // Default to Singapore's coordinates
        const lat = 1.3521;
        const lon = 103.8198;
        resolve({ lat, lon });
      }
    );
  });
};
