import * as AWS from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';

// this is passed from the CDK stack
const { EVENT_MESSAGE_TOPIC_ARN } = process.env;

const sns = new AWS.SNS();

export const publishMessage = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { body } = event;
    if (!body) throw new Error('no body');
    const eventMessages = JSON.parse(body);
    console.log(event);
    for (const eventMessage of eventMessages) {
        const { groupId, message } = eventMessage;
        const response = await sns.publish({
            TopicArn: EVENT_MESSAGE_TOPIC_ARN,
            Message: message,
            MessageGroupId: groupId,
        }).promise();
        console.log(response);
    }
    return {
      statusCode: 200,
      body: eventMessages.length,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    }
  }
}

export const processMessage = async (event: SQSEvent) => {
  console.log('process message start', new Date().toISOString());
  for (const record of event.Records) {
    console.log(`process message... ${record.body}`);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // similate that it takes 3 secs to process the message
  }
  console.log('process message end', new Date().toISOString());
};