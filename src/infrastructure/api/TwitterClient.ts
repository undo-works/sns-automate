import { TwitterApi, TwitterApiReadWrite } from "twitter-api-v2";
import { SsmParameter } from "../aws/SsmParameter";
require("dotenv").config();

export default class TwitterClient {
  /**
   * Twitter APIクライアント
   */
  private client: TwitterApiReadWrite;
  /**
   * SSMのパラメタストアクライアント
   */
  private ssmClient = new SsmParameter();

  /** TwitterアプリキーのSSMパラメタ名 */
  private readonly APP_KEY_SSM_PARAMETER_NAME = "/KG-7th/SNS-AUTOMATE/APP_KEY";

  /** TwitterアプリシークレットのSSMパラメタ名 */
  private readonly APP_SECRET_SSM_PARAMETER_NAME =
    "/KG-7th/SNS-AUTOMATE/APP_SECRET";

  /** TwitterアクセストークンのSSMパラメタ名 */
  private readonly ACCESS_TOKEN_SSM_PARAMETER_NAME =
    "/KG-7th/SNS-AUTOMATE/ACCESS_TOKEN";

  /** TwitterシークレットトークンのSSMパラメタ名 */
  private readonly ACCESS_TOKEN_SECRET_SSM_PARAMETER_NAME =
    "/KG-7th/SNS-AUTOMATE/ACCESS_TOKEN_SECRET";

  constructor() {}

  /**
   * Twitter APIクライアントの初期化
   */
  async initialize(): Promise<void> {
    // Twitter APIキーインスタンスを生成
    const twitterInstance = new TwitterApi({
      // APUキーを環境変数から取得
      appKey: await this.ssmClient.getSsmParameter(
        this.APP_KEY_SSM_PARAMETER_NAME
      ),
      // APIシークレットを環境変数から取得
      appSecret: await this.ssmClient.getSsmParameter(
        this.APP_SECRET_SSM_PARAMETER_NAME
      ),
      // access tokenを環境変数から取得
      accessToken: await this.ssmClient.getSsmParameter(
        this.ACCESS_TOKEN_SSM_PARAMETER_NAME
      ),
      // access token secretを環境変数から取得
      accessSecret: await this.ssmClient.getSsmParameter(
        this.ACCESS_TOKEN_SECRET_SSM_PARAMETER_NAME
      ),
    });
    this.client = twitterInstance.readWrite; // 認証情報を指定してTwitter APIクライアントを生成
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
