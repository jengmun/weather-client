import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface WeatherData {
  id: number;
  weather: { id: number; main: string }[];
  main: { humidity: number; temp: number; temp_min: number; temp_max: number };
  sys: { country: string };
  timezone: number;
  name: string;
}

export const fetchWeather = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<WeatherData> => {
  return await api
    .get(
      `/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${
        import.meta.env.VITE_API_KEY
      }`
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.error(err));
};

export const getCoordinates = async ({
  city,
  country,
}: {
  city: string;
  country: string;
}) => {
  return await api
    .get(
      `/geo/1.0/direct?q=${city},${country}&appid=${
        import.meta.env.VITE_API_KEY
      }`
    )
    .then((res) => {
      return res.data;
    })

    .catch((err) => console.error(err));
};
