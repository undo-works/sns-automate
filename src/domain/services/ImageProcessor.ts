import Jimp = require("jimp");
import JapanWeather from "../../domain/models/JapanWeather";
import { SystemClock } from "../../infrastructure/datetime/SystemClock";

export class ImageProcessor {
  ROOT_URL = ".";

  /**
   * 画像を生成する
   * @param japanWeather 天気情報
   */
  async generateImage(japanWeather: JapanWeather[]) {
    try {
      const font = await Jimp.loadFont("./assets/fonts/brandon.fnt");
      const mapImage = await Jimp.read(
        `${this.ROOT_URL}/assets/images/weather/weather_back.png`
      );
      const [
        clearImage,
        cloudsImage,
        rainImage,
        mistImage,
        snowImage,
        faceImage,
      ] = await Promise.all([
        Jimp.read(`${this.ROOT_URL}/assets/images/weather/hare.png`),
        Jimp.read(`${this.ROOT_URL}/assets/images/weather/kumori.png`),
        Jimp.read(`${this.ROOT_URL}/assets/images/weather/umbrella.png`),
        Jimp.read(`${this.ROOT_URL}/assets/images/weather/mist.png`),
        Jimp.read(`${this.ROOT_URL}/assets/images/weather/snow.png`),
        Jimp.read(`${this.ROOT_URL}/assets/images/weather/face.png`),
      ]);

      faceImage.scale(0.2).circle();
      // mapImage.composite(faceImage, 30, 30);

      japanWeather.forEach((city) => {
        city.data.forEach((hourWeather, index: number) => {
          const weatherImage = this.getWeatherImage(
            hourWeather.weather,
            clearImage,
            cloudsImage,
            rainImage,
            mistImage,
            snowImage
          );

          if (weatherImage) {
            mapImage.composite(
              weatherImage,
              index * 70 + city.location.x,
              city.location.y
            );
          }

          mapImage.print(
            font,
            index * 74 + city.location.x + 8,
            city.location.y + 46,
            hourWeather.temp
          );
        });
      });

      const filename = `${
        this.ROOT_URL
      }/assets/outputs/forcast-${SystemClock.getTimeStamp()}`;
      const result = await mapImage.writeAsync(`${filename}.${"png"}`);
  
      return `${filename}.${"png"}`;
    } catch (e) {
      console.error(e);
      throw new Error("画像の生成に失敗しました。");
    }
  }

  /**
   * 天気の文字列からどの天気画像を取得するかチェック
   * @param weather
   * @param images
   * @returns
   */
  private getWeatherImage(weather: string, ...images: any[]): any | null {
    switch (weather) {
      case "Clear":
        return images[0];
      case "Clouds":
        return images[1];
      case "Rain":
        return images[2];
      case "Mist":
        return images[3];
      case "Snow":
        return images[4];
      default:
        return null;
    }
  }
}
