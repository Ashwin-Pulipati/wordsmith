import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const layer = new lambda.LayerVersion(this, "BaseLayer", {
      code: lambda.Code.fromAsset("lambda_base_layer/layer.zip"),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
      description: "Base Python dependencies for FastAPI + Mangum + OpenAI",
    });
    
    const apiLambda = new lambda.Function(this, "ApiFunction", {
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset("../app/"), 
      handler: "main.handler",
      layers: [layer],
      environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });
    
    const wordsmithApi = new apiGateway.RestApi(this, "RestApi", {
      restApiName: "Wordsmith API",
      description: "API for branding-service Wordsmith backend",
    });

    wordsmithApi.root.addProxy({
      defaultIntegration: new apiGateway.LambdaIntegration(apiLambda),
      anyMethod: true,
    });
  }
}
