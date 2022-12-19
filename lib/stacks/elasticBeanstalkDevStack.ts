import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as elasticbeanstalk from "aws-cdk-lib/aws-elasticbeanstalk";
import * as iam from "aws-cdk-lib/aws-iam";

const appName = "alperquant-api";
const stage = "-dev";

export class ElasticBeanstalkDevStack extends Stack {
  // 👇 set a property for the elasticbeanstalk application
  public readonly ebApp: elasticbeanstalk.CfnApplication;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // EBS IAM Roles
    const EbInstanceRole = new iam.Role(
      this,
      `${appName + stage}-aws-elasticbeanstalk-ec2-role`,
      {
        assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      }
    );

    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AWSElasticBeanstalkWebTier"
    );
    EbInstanceRole.addManagedPolicy(managedPolicy);

    const profileName = `${appName + stage}-InstanceProfile`;

    //An instance profile is a container for an AWS Identity and Access Management (IAM) role
    //  that you can use to pass role information to an Amazon EC2 instance when the instance starts.
    const instanceProfile = new iam.CfnInstanceProfile(this, profileName, {
      instanceProfileName: profileName,
      roles: [EbInstanceRole.roleName],
    });

    //Environment variables for elastic beanstalk environment
    const envVars = [["LAMBDA_KEY", process.env.LAMBDA_KEY]];

    const optionSettingProperties: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] =
      [
        {
          namespace: "aws:ec2:instances",
          optionName: "InstanceTypes",
          value: "t2.micro,t2.small",
        },
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "IamInstanceProfile",
          value: profileName,
        },
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "DisableIMDSv1",
          value: "true",
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MinSize",
          value: "1",
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MaxSize",
          value: "4",
        },
        {
          namespace: "aws:elasticbeanstalk:environment",
          optionName: "EnvironmentType",
          value: "LoadBalanced", //LoadBalanced or SingleInstance
        },
        {
          namespace: "aws:elasticbeanstalk:environment",
          optionName: "LoadBalancerType",
          value: "application", //'classic' by default
        },

        //Add environment variables
        ...envVars.map(([optionName, value]) => ({
          namespace: "aws:elasticbeanstalk:application:environment",
          optionName: optionName as string,
          value: value as string,
        })),
      ];

    const node = this.node;
    const platform = node.tryGetContext("platform");

    // EBS Application
    const app = new elasticbeanstalk.CfnApplication(this, "Application", {
      applicationName: `${appName}-eb-application`,
    });

    // 👇 Assign the created app to the class property. (to Export)
    // So that eb-live-stack can reach out this already created app, without recreating it
    this.ebApp = app;

    // EBS Environment
    const env = new elasticbeanstalk.CfnEnvironment(this, "Environment", {
      description: `Elastic Beanstalk Environment for ${appName + stage}`,
      environmentName: `${appName + stage}-EB-Env`,
      applicationName: app.applicationName || `${appName}-eb-application`,
      platformArn: platform,
      solutionStackName: "64bit Amazon Linux 2 v5.6.2 running Node.js 14",
      optionSettings: optionSettingProperties,
      tags: [
        new cdk.Tag("dev-tag1", "dev-value1"),
        new cdk.Tag("dev-tag2", "dev-value2"),
      ],
    });

    //Make sure that env will be created after app (1 app - N env)
    env.addDependsOn(app);
  }
}
