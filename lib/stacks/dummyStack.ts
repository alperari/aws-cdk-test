import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class DummyLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dummyLambda = new lambda.Function(this, "dummy-lambda", {
      // "HelloHandler" is  local identity of the construct,  It’s an ID that has to be unique amongst construct within the same scope

      //fields below are "props" of the current stack
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "hello.handler", // file is "hello", function is "handler"
    });

    const dummyLambda2 = new lambda.Function(this, "dummy-lambda-2", {
      // "HelloHandler" is  local identity of the construct,  It’s an ID that has to be unique amongst construct within the same scope

      //fields below are "props" of the current stack
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "hello.handler", // file is "hello", function is "handler"
    });
  }
}
