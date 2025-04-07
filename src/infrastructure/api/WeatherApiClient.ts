import { SsmParameter } from "../aws/SsmParameter";
import { CurrentOpenWeatherMapResponse, ForcastOpenWeatherMapResponse } from "./types/weather-type";
require("dotenv").config();

export default class WeaterApiClient {
  /**
   * SSMのパラメタストアクライアント
   */
  private ssmClient = new SsmParameter();

  /** TwitterアプリキーのSSMパラメタ名 */
  private readonly OPEN_WEATHER_SSM_PARAMETER_NAME = "/KG-7th/SNS-AUTOMATE/OPEN_WEATHER_API_KEY";

  /**
   * 現在の天気を取得
   * @param city
   * @returns
   */
  async fetchCurrntWeather(
    cityName: string
  ): Promise<CurrentOpenWeatherMapResponse> {
    // 現在の天気を取得
    const API_URL = `https://api.openweathermap.org/data/2.5/weather/?q=${cityName}&appid=${await this.ssmClient.getSsmParameter(this.OPEN_WEATHER_SSM_PARAMETER_NAME)}&units=metric`;
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
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast/?q=${cityName}&appid=${await this.ssmClient.getSsmParameter(this.OPEN_WEATHER_SSM_PARAMETER_NAME)}&units=metric`;
    const res = await fetch(API_URL);
    const resBody = (await res.json()) as ForcastOpenWeatherMapResponse;
    return resBody;
  }
}