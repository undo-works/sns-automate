import { CurrentOpenWeatherMapResponse, ForcastOpenWeatherMapResponse } from "./types/weather-type";
require("dotenv").config();

export default class WeaterApiClient {
  /**
   * 現在の天気を取得
   * @param city
   * @returns
   */
  async fetchCurrntWeather(
    cityName: string
  ): Promise<CurrentOpenWeatherMapResponse> {
    // 現在の天気を取得
    const API_URL = `https://api.openweathermap.org/data/2.5/weather/?q=${cityName}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;
    const res = await fetch(API_URL);
    const resBody = (await res.json()) as CurrentOpenWeatherMapResponse;
    return resBody;
  }

  /**
   * 天気予報を取得
   * @param city
   * @returns
   */
  async fetchForecastWeather(
    cityName: string
  ): Promise<ForcastOpenWeatherMapResponse> {
    // 天気予報を取得
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast/?q=${cityName}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;
    const res = await fetch(API_URL);
    const resBody = (await res.json()) as ForcastOpenWeatherMapResponse;
    return resBody;
  }
}