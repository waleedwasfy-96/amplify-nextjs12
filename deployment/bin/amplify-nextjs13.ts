#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {PipelineStack} from "../lib/pipeline-stack";

const app = new cdk.App();

new PipelineStack(app, "amplify-nextjs13-infra-pipeline", {
    codestarArn:
        "arn:aws:codestar-connections:us-east-1:037011317234:connection/5edb10a6-c203-4810-88e3-25161f7cb96b",
    pipelineName: "amplify-pipeline",
    repositoryName: "leejjon/amplify-nextjs13",
    branchName: "main"
});
