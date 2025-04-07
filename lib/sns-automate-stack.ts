import * as path from 'path';
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class SnsAutomateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Lambda Layerの作成 (assets を指定)
    const layer = new lambda.LayerVersion(this, 'arn:aws:lambda:ap-northeast-1:123456789012:layer:SnsAutomateLayer:2', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../assets')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X], // Node.jsランタイムを指定
      description: 'Lambda Layer for SNS Automate project',
    });

    const fn = new NodejsFunction(this, 'lambda', {
      functionName: "SnsAutomateFunction",
      entry: 'src/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [layer], // 作成したレイヤーを追加
      timeout: cdk.Duration.seconds(20), // 少し長め
      memorySize: 256, // 128だと動かなかった
      role: cdk.aws_iam.Role.fromRoleArn(this, 'SnsAutomateFunctionRole', 'arn:aws:iam::123456789012:role/SnsAutomateFunctionRole'),
      environment: {
        ROOT_URL: '/opt', // レイヤー内のアセットを参照するために設定
      },
    })
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })
    new apigw.LambdaRestApi(this, 'myapi', {
      handler: fn,
    })

    // CloudWatch Eventsルールを作成
    new cdk.aws_events.Rule(this, 'SnsAutomateWeatherTweetScheduleRule', {
      ruleName: "SnsAutomateWeatherTweetScheduleRule",
      // 毎朝7時に実行
      schedule: cdk.aws_events.Schedule.cron({ minute: '0', hour: '22' }),
      targets: [new cdk.aws_events_targets.LambdaFunction(fn)],
    });
  }
}