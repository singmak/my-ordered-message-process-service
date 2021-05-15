import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as lambda from '@aws-cdk/aws-lambda';

export class MyOrderedMessageProcessServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const eventMessageTopic = new sns.Topic(this, 'EventMessageTopic', {
      topicName: 'eventMessages',
      fifo: true,
      contentBasedDeduplication: true,
    });

    const publishEventLambda = new lambda.Function(this, 'publishEventMessage', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("./lambda"),
      handler: "handler.publishMessage",
      environment: {
        EVENT_MESSAGE_TOPIC_ARN: eventMessageTopic.topicArn,
      }
    });

    // grant the lambda permission to publish message to the SNS topic
    eventMessageTopic.grantPublish(publishEventLambda);
  }
}
