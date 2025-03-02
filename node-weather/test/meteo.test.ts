import { fetchWeatherApi } from "openmeteo";
import { fetchWeather, printWeather, weatherToString } from "../src/meteo";
import { UnitType } from "../src/types";
import { mockedFetchWeatherApi } from "./test-mocks";

jest.mock("openmeteo", () => ({
  fetchWeatherApi: jest.fn(),
}));

export const TEST_TIME = 1740925800;
export const TEST_C_CURRENT = -5.222;
export const TEST_C_HIGH = 3.555;
export const TEST_C_LOW = -7.001;
export const TEST_F_CURRENT = 22.777;
export const TEST_F_HIGH = 38.333;
export const TEST_F_LOW = 19.444;
const expectedWeatherString =
  "Location: Penn Station, NYC\n" +
  "Time:     Sun Mar 02 2025 09:30:00 GMT-0500 (Eastern Standard Time)\n" +
  "Current:  22.8 ˚F / -5.2 ˚C\n" +
  "High:     38.3 ˚F / 3.6 ˚C\n" +
  "Low:      19.4 ˚F / -7.0 ˚C\n";

describe("weather test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    (fetchWeatherApi as jest.Mock).mockReturnValue(
      mockedFetchWeatherApi(UnitType.Imperial),
    );

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

  test("to string test", async () => {
    // arrange
    (fetchWeatherApi as jest.Mock).mockReturnValueOnce(mockedFetchWeatherApi());
    (fetchWeatherApi as jest.Mock).mockReturnValueOnce(
      mockedFetchWeatherApi(UnitType.Imperial),
    );

    // act
    const weatherString = await weatherToString();

    // assert
    expect(weatherString).toEqual(expectedWeatherString);
  });

  test("print test", async () => {
    // arrange
    console.log = jest.fn();
    (fetchWeatherApi as jest.Mock).mockReturnValueOnce(mockedFetchWeatherApi());
    (fetchWeatherApi as jest.Mock).mockReturnValueOnce(
      mockedFetchWeatherApi(UnitType.Imperial),
    );

    // act
    await printWeather();

    // assert
    expect(console.log).toHaveBeenCalledWith(expectedWeatherString);
  });
});
