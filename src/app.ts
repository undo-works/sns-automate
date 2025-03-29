import { Hono } from "hono";
import { TweetWeatherUseCase } from "./application/weather_tweet.ts/TweetWeatherUseCase";

/** Honoインスタンス */
const app = new Hono()

const tweetWeather = new TweetWeatherUseCase();

// ルーティング
app.get('/', async(c) => await tweetWeather.tweetWeather())  // 確認用

export default app;