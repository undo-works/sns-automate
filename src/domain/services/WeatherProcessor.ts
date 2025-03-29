import JapanWeather from "../models/JapanWeather";
import WeatherApiClient from "../../infrastructure/api/WeatherApiClient"; // Adjust the path as needed

export class WeatherProcessor {

  /**
   * 天気予報データを整形する
   * @returns 
   */
  async shapeWeatherData() {

    // 天気予報データを取得
    const weatherApiClient = new WeatherApiClient();

    // 天気情報の初期化
    var japanWeather: JapanWeather[] = [
      {
        cityName: "Sapporo",
        data: [],
        location: {
          x: 791,
          y: 306,
        },
      },
      {
        cityName: "Sendai",
        data: [],
        location: {
          x: 776,
          y: 550,
        },
      },
      {
        cityName: "Tokyo",
        data: [],
        location: {
          x: 749,
          y: 855,
        },
      },
      {
        cityName: "Nigata",
        data: [],
        location: {
          x: 601,
          y: 694,
        },
      },
      {
        cityName: "Nagoya",
        data: [],
        location: {
          x: 537,
          y: 922,
        },
      },
      {
        cityName: "Osaka",
        data: [],
        location: {
          x: 393,
          y: 802,
        },
      },
      {
        cityName: "Fukuoka",
        data: [],
        location: {
          x: 81,
          y: 762,
        },
      },
      {
        cityName: "Naha",
        data: [],
        location: {
          x: 18,
          y: 915,
        },
      },
    ];
    // set weather now
    const weatherNowPromises = japanWeather.map(async (city, index) => {
      try {
        const resBody = await weatherApiClient.fetchCurrntWeather(city.cityName);
        console.log(resBody);
        japanWeather[index].data.push({
          weather: resBody.weather[0].main,
          temp: Math.floor((resBody.main.temp_min + resBody.main.temp_max) / 2),
        });
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all([...weatherNowPromises]);
    // set forecast weather
    const forecastPromises = japanWeather.map(async (city, index) => {
      try {
        const resBody = await weatherApiClient.fetchForecastWeather(city.cityName);
        console.log(resBody.list[1]);
        console.log(resBody.list[3]);
        // set 12:00 weather
        japanWeather[index].data.push({
          weather: resBody.list[1].weather[0].main,
          temp: Math.floor(
            (resBody.list[1].main.temp_min + resBody.list[1].main.temp_max) / 2
          ),
        });
        // set 18:00 weather
        japanWeather[index].data.push({
          weather: resBody.list[3].weather[0].main,
          temp: Math.floor(
            (resBody.list[3].main.temp_min + resBody.list[3].main.temp_max) / 2
          ),
        });
      } catch (e) {
        console.error(e);
      }
    });
    await Promise.all([...forecastPromises]);
    return japanWeather;
  }
}
