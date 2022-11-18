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

        const secret = secretsmanager.Secret.fromSecretAttributes(this, "Secret", {
            secretPartialArn: `arn:aws:secretsmanager:ca-central-1:039085306114:secret:secret-oLzfPr`,
        });

        const amplifyRole = new iam.Role(this, "AmplifyRole", {
            assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
            inlinePolicies: {
                mainpolicy: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: [
                                "s3:*",
                                "amplify:*",
                                "cloudformation:*",
                                "cloudfront:*",
                                "iam:*",
                                "lambda:*"
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
            oauthToken: secret.secretValueFromJson("GithubOauthToken").unsafeUnwrap(),
            basicAuthConfig: {
                enableBasicAuth: true,
                password: "awssupport",
                username: "hello",
            },
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
                        '[{"name":"Amplify CLI","pkg":"@aws-amplify/cli","type":"npm","version":"latest"},{"name":"Next.js version","pkg":"next-version","type":"internal","version":"latest"}]',
                },
                {
                    name: "AMPLIFY_SKIP_BACKEND_BUILD",
                    value: "TRUE"
                }
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
