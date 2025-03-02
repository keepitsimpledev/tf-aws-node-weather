import { fetchWeatherApi } from "openmeteo";
import { fetchWeather } from "../src/meteo";
import { UnitType } from "../src/types";

jest.mock("openmeteo", () => ({
  fetchWeatherApi: jest.fn(),
}));

const TEST_TIME = 1740925800;
const TEST_C_CURRENT = -5.222;
const TEST_C_HIGH = 3.555;
const TEST_C_LOW = -7.000
const TEST_F_CURRENT = 22.777;
const TEST_F_HIGH = 38.333;
const TEST_F_LOW = 19.444;

function getCurrentTemp(i: number, unitType: UnitType) {
  if (i != 0) {
    return null;
  } else if (UnitType.Imperial == unitType) {
    return TEST_F_CURRENT;
  } else {
    return TEST_C_CURRENT;
  }
}

function getMinOrMaxTemp(i: number, unitType: UnitType): Float32Array | null {
  const metric = [TEST_C_HIGH, TEST_C_LOW];
  const imperial = [TEST_F_HIGH, TEST_F_LOW];

  let response = new Float32Array(1);
  if (i < 0 || i > 1) {
    return null;
  } else if (UnitType.Imperial == unitType) {
    response[0] = imperial[i];
  } else {
    response[0] = metric[i];
  }
  return response;
}

function mockedFetchWeatherApi(unitType: UnitType = UnitType.Metric): any[] {
  const time = BigInt(TEST_TIME);

  return [{
    utcOffsetSeconds: () => { return 0; },
    current: () => {
      return {
        time: (): bigint => { return time; },
        variables: (i: number) => { return { value: () => { return getCurrentTemp(i, unitType); }}}
      }
    },
    daily: () => {
      return {
        variables: (i: number) => { return { valuesArray: (): Float32Array | null => { return getMinOrMaxTemp(i, unitType); }}}
      }
    }
  }];
}

describe("weather test", () => {

  test("metric test", async () => {
    // arrange
    (fetchWeatherApi as jest.Mock).mockReturnValue(mockedFetchWeatherApi());

    // act
    const weatherData = await fetchWeather();

    // assert
    const expectedTime = new Date(Number(BigInt(TEST_TIME)) * 1000);
    
    const expectedHigh = new Float32Array(1);
    expectedHigh[0] = TEST_C_HIGH;

    const expectedLow = new Float32Array(1);
    expectedLow[0] = TEST_C_LOW;

    expect(weatherData.current.time).toEqual(expectedTime);
    expect(weatherData.current.temperature2m).toEqual(TEST_C_CURRENT);
    expect(weatherData.daily.temperature2mMax).toEqual(expectedHigh);
    expect(weatherData.daily.temperature2mMin).toEqual(expectedLow);
  });

  test("imperial test", async () => {
    // arrange
    (fetchWeatherApi as jest.Mock).mockReturnValue(mockedFetchWeatherApi(UnitType.Imperial));

    // act
    const weatherData = await fetchWeather(UnitType.Imperial);

    // assert
    const expectedTime = new Date(Number(BigInt(TEST_TIME)) * 1000);
    
    const expectedHigh = new Float32Array(1);
    expectedHigh[0] = TEST_F_HIGH;

    const expectedLow = new Float32Array(1);
    expectedLow[0] = TEST_F_LOW;

    expect(weatherData.current.time).toEqual(expectedTime);
    expect(weatherData.current.temperature2m).toEqual(TEST_F_CURRENT);
    expect(weatherData.daily.temperature2mMax).toEqual(expectedHigh);
    expect(weatherData.daily.temperature2mMin).toEqual(expectedLow);
  });

});
