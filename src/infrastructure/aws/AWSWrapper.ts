import * as AWS from "aws-sdk";

export default class AWSWrapper {

  /**
   * AWS SDKのインスタンス
   */
  protected aws = AWS;

  constructor() {
    this.aws.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_PRIVATE_KEY,
    });
  }
}
