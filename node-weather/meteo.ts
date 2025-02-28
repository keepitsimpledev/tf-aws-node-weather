import { fetchWeatherApi } from 'openmeteo';

/*
  TODO:
  -parameterize fetchAndPrintWeather
  -create types for units (temp: F and C, wind: mph and kph, precip: inch and mil)
*/

async function fetchAndPrintWeather() {
  const params = {
    "latitude": 40.755,
    "longitude": -73.993,
    "current": "temperature_2m",
    "daily": ["temperature_2m_max", "temperature_2m_min"],
    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "mph",
    "precipitation_unit": "inch",
    "timezone": "America/New_York",
    "forecast_days": 1
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  
  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  
  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];
  
  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();
  
  const current = response.current()!;
  const daily = response.daily()!;
  
  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
  
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
    },
    daily: {
      time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      temperature2mMax: daily.variables(0)!.valuesArray()!,
      temperature2mMin: daily.variables(1)!.valuesArray()!,
    },
  
  };
  
  console.log(`Time: ${weatherData.current.time}`);
  console.log(`Current: ${weatherData.current.temperature2m} ˚F`);

  // `weatherData` now contains a simple structure with arrays for datetime and weather data
  for (let i = 0; i < weatherData.daily.time.length; i++) {
    console.log(`High: ${weatherData.daily.temperature2mMax[i]} ˚F`);
    console.log(`Low: ${weatherData.daily.temperature2mMin[i]} ˚F`);
  }

}

fetchAndPrintWeather();
