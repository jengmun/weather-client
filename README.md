# Weather App

This project is a weather application that allows users to search for the current weather in various cities and countries using the OpenWeather API. Users can also view their search history and switch between light and dark themes.


This application is deployed at the following URL: [https://jengmun.github.io/weather-client](https://jengmun.github.io/weather-client/)

---

## Features

1. **Search Weather by City and Country**

   - By default, the application displays the weather according to the user's geographical location.
   - Users can input a city and country code (e.g., `Singapore, SG`) to fetch weather data.
   - Utilizes OpenWeatherAPI to retrieve accurate weather information.

2. **Search History**

   - Keeps track of recent searches with details such as city, country, and search time.
   - Allows users to re-fetch weather data for past searches or delete individual records.

3. **Theme Toggle**

   - Supports both light and dark modes.

4. **Error Handling**

   - Provides messages for invalid inputs or API errors.

5. **Responsive Design**

   - Optimized for various screen sizes.

---

## Installation

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/jengmun/weather-client.git
   cd weather-client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:

   ```env
   VITE_API_KEY=<your_openweather_api_key>
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## Usage

1. Enter the city and country code in the input field (e.g., `Singapore, SG`).
2. Click the **Search** button to fetch and display weather information.
3. View past searches in the **Search History** section.
4. Re-fetch weather data by clicking the search button in a history record.
5. Remove a specific record from the history using the delete button.
6. Toggle between light and dark modes using the theme switcher at the top-left corner.

---

## Technologies Used

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

---

## Notes

- Old search history entries are removed if the same city is searched again.

- The application uses a new API with geolocation, avoiding deprecated APIs (API requests by city name).

- Autocomplete is not implemented due to API rate limits.

- Assumes that only one result is returned for each search query.

- All weather icons display "Cloud" unless the weather is "Clear Sky" or "Few Clouds."

## Future Improvements

1. Allow users to select their desired location if multiple locations with the same name are returned.
