type WeatherData = {
  current: {
    time: Date,
    temperature2m: number,
  },
  daily: {
    time: Date[],
    temperature2mMax: Float32Array<ArrayBuffer>,
    temperature2mMin: Float32Array<ArrayBuffer>,
  }
}

type WeatherParameters = {
  latitude: number,
  longitude: number,
  current: string,
  daily: string[],
  temperature_unit?: string,
  wind_speed_unit?: string,
  precipitation_unit?: string,
  timezone?: string,
  forecast_days: number
}

const enum UnitType {
  Imperial, Metric
}
