import { UnitType } from "../src/types";
import { TEST_C_CURRENT, TEST_C_HIGH, TEST_C_LOW, TEST_F_CURRENT, TEST_F_HIGH, TEST_F_LOW, TEST_TIME } from "./meteo.test";

function getCurrentTemp(i: number, unitType: UnitType): number {
  if (i != 0) {
    return -273;
  } else if (UnitType.Imperial == unitType) {
    return TEST_F_CURRENT;
  } else {
    return TEST_C_CURRENT;
  }
}

function getMinOrMaxTemp(i: number, unitType: UnitType): Float32Array | null {
  const metric = [TEST_C_HIGH, TEST_C_LOW];
  const imperial = [TEST_F_HIGH, TEST_F_LOW];

  const response = new Float32Array(1);
  if (i < 0 || i > 1) {
    return null;
  } else if (UnitType.Imperial == unitType) {
    response[0] = imperial[i];
  } else {
    response[0] = metric[i];
  }
  return response;
}

type SimplifiedWeatherApiResponse = {
  utcOffsetSeconds: () => number
  current: () => {
    time: () => bigint,
    variables: (i: number) => {
      value: () => number
    }
  },
  daily: () => {
    variables: (i: number) => {
      valuesArray: () => Float32Array | null
    }
  }
}

export function mockedFetchWeatherApi(unitType: UnitType = UnitType.Metric): SimplifiedWeatherApiResponse[] {
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
