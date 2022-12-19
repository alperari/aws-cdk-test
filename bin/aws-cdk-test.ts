#!/usr/bin/env node
require("dotenv").config();
import * as cdk from "aws-cdk-lib";
import { AwsCdkTestStack } from "../lib/stacks/aws-cdk-test-stack";
import { ElasticBeanstalkDevStack } from "../lib/stacks/elasticBeanstalkDevStack";
import { ElasticBeanstalkLiveStack } from "../lib/stacks/elasticBeanstalkLiveStack";
import { DummyLambdaStack } from "../lib/stacks/dummyStack";

const app = new cdk.App();

const awsCdkTestStack = new AwsCdkTestStack(app, "aws-test-stack");
const elasticBeanstalkDevStack = new ElasticBeanstalkDevStack(
  app,
  "elasticbeanstalk-dev-stack"
);
const elasticBeanstalkLiveStack = new ElasticBeanstalkLiveStack(
  app,
  "elasticbeanstalk-live-stack",
  {
    ebApp: elasticBeanstalkDevStack.ebApp,
  }
);

const dummyLambdaStack = new DummyLambdaStack(app, "dummy-lambda-stack");
