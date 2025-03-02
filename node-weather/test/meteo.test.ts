import { fetchWeatherApi } from "openmeteo";
import { fetchWeather } from "../src/meteo";

jest.mock("openmeteo", () => ({
  fetchWeatherApi: jest.fn(),
}));

describe("testing index file", () => {
  test("empty string should result in zero", () => {
    // TODO: clean this up
    (fetchWeatherApi as jest.Mock).mockReturnValue([
      {
        utcOffsetSeconds: () => {
          return 1740899010;
        },
        current: () => {
          return {
            time: (): bigint => {
              return BigInt(0); // what's a good value for this?
            },
            variables: (i: number) => {
              return {
                value: () => {
                  return i;
                },
              };
            },
          };
        },
        daily: () => {
          return {
            variables: (i: number) => {
              return {
                valuesArray: () => {
                  return [i];
                },
              };
            },
          };
        },
      },
    ]);
    fetchWeather();

    // TODO: assert
    expect(1).toBe(0);
  });
});
