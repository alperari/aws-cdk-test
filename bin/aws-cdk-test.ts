#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkTestStack } from '../lib/aws-cdk-test-stack';

const app = new cdk.App();
new AwsCdkTestStack(app, 'AwsCdkTestStack');
