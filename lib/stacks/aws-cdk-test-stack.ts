import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class AwsCdkTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, "HelloHandler", {
      // "HelloHandler" is  local identity of the construct,  It’s an ID that has to be unique amongst construct within the same scope

      //fields below are "props" of the current stack
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "hello.handler", // file is "hello", function is "handler"
    });

    new apigw.LambdaRestApi(this, "Endpoint", {
      handler: hello,
    });

    const mylambda = lambda.Function.fromFunctionArn(
      this,
      "lambda-from-console-1",
      "arn:aws:lambda:eu-central-1:510692167157:function:mylambda"
    );

    new apigw.LambdaRestApi(this, "ApiGateway-Endpoint-mylambda", {
      handler: mylambda,
    });

    const node = this.node;
    const platform = node.tryGetContext("platform");
  }
}
