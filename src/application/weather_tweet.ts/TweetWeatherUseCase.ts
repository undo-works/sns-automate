import { ImageProcessor } from "../../domain/services/ImageProcessor";
import { WeatherProcessor } from "../../domain/services/WeatherProcessor";
import TwitterClient from "../../infrastructure/api/TwitterClient";

export class TweetWeatherUseCase {

  /**
   * 天気予報画像を作成してツイートする
   */
  async tweetWeather() {
    // 天気予報データを取得
    const weatherProcessor = new WeatherProcessor();
    const weatherData = await weatherProcessor.shapeWeatherData();

    // 画像を生成
    const imageProcessor = new ImageProcessor();
    const filepath = await imageProcessor.generateImage(weatherData);

    // Twitterにツイートする
    const twitterClient = new TwitterClient();
    await twitterClient.tweetWithImage(
      filepath,
      "今日の天気予報です！\n今日も一日頑張りましょう！\n#天気予報 #天気 #WeatherForecast #Weather\n＊これは自動投稿です。\n＊天気情報取得はOpenWeatherMapを使用しています。"
    );
  }
}