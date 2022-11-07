import {
    aws_amplify as amplify,
    aws_iam as iam,
    aws_secretsmanager as secretsmanager,
    aws_ssm as ssm,
    CfnCondition,
    Fn,
    Stack,
    StackProps,
    Tags,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface AmplifyStackProps extends StackProps {
    username: string;
    appName: string;
    appDescription: string;
    stageName: string;
    repository: string;
    branchName: string;
    basicAuthPassword: string;
}

export class WebAmplifyStack extends Stack {
    constructor(scope: Construct, id: string, props: AmplifyStackProps) {
        super(scope, id, props);

        // const secret = secretsmanager.Secret.fromSecretAttributes(this, "Secret", {
        //     secretPartialArn: `arn:aws:secretsmanager:eu-central-1:039085306114:secret:css-secrets-3eVZL2`,
        // });

        const amplifyRole = new iam.Role(this, "AmplifyRole", {
            assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
            inlinePolicies: {
                mainpolicy: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: [
                                "amplify:CreateBackendEnvironment",
                                "amplify:CreateBranch",
                                "amplify:DeleteBackendEnvironment",
                                "amplify:GetApp",
                                "amplify:GetBackendEnvironment",
                                "amplify:GetBranch",
                                "amplify:ListApps",
                                "amplify:ListBackendEnvironments",
                                "amplify:ListBranches",
                                "amplify:ListDomainAssociations",
                                "amplify:UpdateApp",
                                "amplify:UpdateBranch",
                                "cloudformation:CreateChangeSet",
                                "cloudformation:CreateStack",
                                "cloudformation:CreateStackSet",
                                "cloudformation:DeleteStack",
                                "cloudformation:DeleteStackSet",
                                "cloudformation:DescribeChangeSet",
                                "cloudformation:DescribeStackEvents",
                                "cloudformation:DescribeStackResource",
                                "cloudformation:DescribeStackResources",
                                "cloudformation:DescribeStacks",
                                "cloudformation:DescribeStackSet",
                                "cloudformation:DescribeStackSetOperation",
                                "cloudformation:ExecuteChangeSet",
                                "cloudformation:GetTemplate",
                                "cloudformation:ListStackResources",
                                "cloudformation:UpdateStack",
                                "cloudformation:UpdateStackSet",
                                "cloudfront:CreateCloudFrontOriginAccessIdentity",
                                "cloudfront:CreateDistribution",
                                "cloudfront:CreateInvalidation",
                                "cloudfront:DeleteDistribution",
                                "cloudfront:GetDistribution",
                                "cloudfront:GetDistributionConfig",
                                "cloudfront:ListTagsForResource",
                                "cloudfront:TagResource",
                                "cloudfront:UpdateDistribution",
                                "cloudfront:UntagResource",
                                "iam:CreateRole",
                                "iam:DeleteRole",
                                "iam:DeleteRolePolicy",
                                "iam:GetRole",
                                "iam:PassRole",
                                "iam:PutRolePolicy",
                                "kms:CreateGrant",
                                "kms:Decrypt",
                                "kms:DescribeKey",
                                "kms:Encrypt",
                                "lambda:AddLayerVersionPermission",
                                "lambda:AddPermission",
                                "lambda:CreateEventSourceMapping",
                                "lambda:CreateFunction",
                                "lambda:DeleteEventSourceMapping",
                                "lambda:DeleteFunction",
                                "lambda:DeleteLayerVersion",
                                "lambda:EnableReplication*",
                                "lambda:GetEventSourceMapping",
                                "lambda:GetFunction",
                                "lambda:GetFunctionConfiguration",
                                "lambda:GetLayerVersion",
                                "lambda:GetLayerVersionByArn",
                                "lambda:InvokeAsync",
                                "lambda:InvokeFunction",
                                "lambda:ListEventSourceMappings",
                                "lambda:ListLayerVersions",
                                "lambda:PublishLayerVersion",
                                "lambda:PublishVersion",
                                "lambda:RemoveLayerVersionPermission",
                                "lambda:RemovePermission",
                                "lambda:UpdateFunctionCode",
                                "lambda:UpdateFunctionConfiguration",
                                "s3:CreateBucket",
                                "s3:DeleteBucket",
                                "s3:DeleteBucketPolicy",
                                "s3:DeleteBucketWebsite",
                                "s3:DeleteObject",
                                "s3:DeleteObjectVersion",
                                "s3:GetAccelerateConfiguration",
                                "s3:GetBucketLocation",
                                "s3:GetObject",
                                "s3:ListAllMyBuckets",
                                "s3:ListBucket",
                                "s3:ListBucketVersions",
                                "s3:PutAccelerateConfiguration",
                                "s3:PutBucketAcl",
                                "s3:PutBucketCORS",
                                "s3:PutBucketNotification",
                                "s3:PutBucketPolicy",
                                "s3:PutBucketWebsite",
                                "s3:PutEncryptionConfiguration",
                                "s3:PutObject",
                                "s3:PutObjectAcl",
                                "ssm:GetParametersByPath",
                                "sts:AssumeRole",
                                "iam:CreateServiceLinkedRole",
                            ],
                            resources: ["*"],
                        }),
                    ],
                }),
            },
        });

        const amplifyApp = new amplify.CfnApp(this, "AmplifyApp", {
            name: props.appName,
            description: props.appDescription,
            iamServiceRole: amplifyRole.roleArn,
            repository: props.repository,
            // oauthToken: secret.secretValueFromJson("GithubOauthToken").unsafeUnwrap(),
            // basicAuthConfig: {
            //     enableBasicAuth: true,
            //     password: props.basicAuthPassword,
            //     username: props.username,
            // },
            environmentVariables: [
                // {
                //   name: "AMPLIFY_MONOREPO_APP_ROOT",
                //   value: "apps/web",
                // },
                // If on this page they tell us that Next.js 12 is supported, update 11 to 12.
                // https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html#update-app-nextjs-version
                {
                    name: "_LIVE_UPDATES",
                    value:
                        '[{"name":"Next.js version","pkg":"next-version","type":"internal","version":"latest"}]',
                },
            ],
        });

        new amplify.CfnBranch(this, "AmplifyBranch", {
            appId: amplifyApp.attrAppId,
            branchName: props.branchName,
            stage: "PRODUCTION",
            enableAutoBuild: true,
        });
    }
}
