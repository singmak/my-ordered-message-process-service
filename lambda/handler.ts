import * as AWS from 'aws-sdk';

const { EVENT_MESSAGE_TOPIC_ARN } = process.env;

const sns = new AWS.SNS();

export const publishMessage = async (event: Record<string, unknown>) => {
  console.log(event);
  const response = await sns.publish({
    TopicArn: EVENT_MESSAGE_TOPIC_ARN,
    Message: JSON.stringify(event),
  }).promise();
  return response;
}