# デプロイ方法

```bash
# プロジェクトのデプロイ
cdk deploy
```

# Bitmapの文字画像生成

Lambdaで公開すると、Jimpの文字フォントが読み出せなくなるので
プロジェクト内に静的ファイルとして配置しておく

## 参考URL

BMfontツールを利用したフォントの生成方法について
https://nakamura001.hatenablog.com/entry/20120910/1347241168

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
