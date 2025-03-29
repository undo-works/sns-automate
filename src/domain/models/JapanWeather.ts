/**
 * 天気情報の型
 */
export default interface JapanWeather {
  /** 都市名 */
  cityName: string;
  /** 天気情報 */
  data: { weather: string, temp: number }[];
  /** 画像の位置情報 */
  location: {
    x: number;
    y: number;
  };
};