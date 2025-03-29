import { TwitterApi, TwitterApiReadWrite } from "twitter-api-v2";
require("dotenv").config();

export default class TwitterClient {
  /**
   * Twitter APIクライアント
   */
  private client: TwitterApiReadWrite;

  constructor() {
    // Twitter APIキーインスタンスを生成
    const twitterInstance = new TwitterApi({
      // APUキーを環境変数から取得
      appKey: process.env.APP_KEY!,
      // APIシークレットを環境変数から取得
      appSecret: process.env.APP_SECRET!,
      // access tokenを環境変数から取得
      accessToken: process.env.ACCESS_TOKEN!,
      // access token secretを環境変数から取得
      accessSecret: process.env.ACCESS_TOKEN_SECRET!,
    });
    // 権限はread/writeを指定
    this.client = twitterInstance.readWrite;
  }

  /**
   * 画像付きツイートを行う
   * @param imagePath 画像パス
   * @param text ツイート内容
   */
  tweetWithImage = async (imagePath: string, text: string) => {
    // 画像をアップロードしてメディアIDを取得
    const imageId = await this.client.v1.uploadMedia(imagePath);
    // ツイートを行う
    await this.client.v2.tweet(text, { media: { media_ids: [imageId] } });
  };

  /**
   * ツイートを行う
   * @param imagePath 画像パス
   * @param text ツイート内容
   */
  tweetDefault = async (text: string) => {
    await this.client.v2.tweet(text);
  };
}
