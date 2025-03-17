import { fetchWeatherApi } from "openmeteo";
import { UnitType, WeatherData, WeatherParameters } from "./types";


const LOCATION_NAME = "Penn Station, NYC";
const LOCATION_TZ = "America/New_York";
const PENN_STATTION_LATITUDE = 40.78846;
const PENN_STATION_LONGITUDE = -73.386034;

export async function fetchWeather(
  unitType: UnitType = UnitType.Metric,
): Promise<WeatherData> {
  const meteoApiParams: WeatherParameters = {
    latitude: PENN_STATTION_LATITUDE,
    longitude: PENN_STATION_LONGITUDE,
    current: "temperature_2m",
    daily: ["temperature_2m_max", "temperature_2m_min"],
    forecast_days: 1,
  };

  if (unitType == UnitType.Imperial) {
    meteoApiParams.temperature_unit = "fahrenheit";
    meteoApiParams.wind_speed_unit = "mph";
    meteoApiParams.precipitation_unit = "inch";
  }

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, meteoApiParams);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!

  const weatherData: WeatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
    },
    daily: {
      temperature2mMax: daily.variables(0)!.valuesArray()!,
      temperature2mMin: daily.variables(1)!.valuesArray()!,
    },
  };

  return weatherData;
}

export async function weatherToString(): Promise<string> {
  const metricWeather = await fetchWeather();
  const imperialWeather = await fetchWeather(UnitType.Imperial);

  const fCurrent = imperialWeather.current.temperature2m.toFixed(1);
  const cCurrent = metricWeather.current.temperature2m.toFixed(1);

  const fHigh = imperialWeather.daily.temperature2mMax[0].toFixed(1);
  const cHigh = metricWeather.daily.temperature2mMax[0].toFixed(1);

  const fLow = imperialWeather.daily.temperature2mMin[0].toFixed(1);
  const cLow = metricWeather.daily.temperature2mMin[0].toFixed(1);

  let weather: string = "";
  weather += `Location:   ${LOCATION_NAME}\n`;
  weather += `Local Time: ${metricWeather.current.time.toLocaleString("en-US", { timeZone: LOCATION_TZ })}\n`;
  weather += `Current:    ${fCurrent} ˚F / ${cCurrent} ˚C\n`;
  weather += `High:       ${fHigh} ˚F / ${cHigh} ˚C\n`;
  weather += `Low:        ${fLow} ˚F / ${cLow} ˚C\n`;

  return weather;
}

export async function printWeather() {
  console.log(await weatherToString());
}
