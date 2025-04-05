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
    const layer = new lambda.LayerVersion(this, 'SnsAutomateLayer', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../assets')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X], // Node.jsランタイムを指定
      description: 'Lambda Layer for SNS Automate project',
    });

    const fn = new NodejsFunction(this, 'lambda', {
      entry: 'src/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [layer], // 作成したレイヤーを追加
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
  }
}