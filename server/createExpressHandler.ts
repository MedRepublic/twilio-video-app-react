import 'dotenv/config';
import { Request, Response } from 'express';
import { ServerlessContext, ServerlessFunction } from './types';
import Twilio from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  TWILIO_CONVERSATIONS_SERVICE_SID,
  REACT_APP_TWILIO_ENVIRONMENT,
} = process.env;

const twilioClient = Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID,
  region: REACT_APP_TWILIO_ENVIRONMENT === 'prod' ? undefined : REACT_APP_TWILIO_ENVIRONMENT,
});

const context: ServerlessContext = {
  ACCOUNT_SID: TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  ROOM_TYPE: 'group',
  CONVERSATIONS_SERVICE_SID: TWILIO_CONVERSATIONS_SERVICE_SID,
  getTwilioClient: () => twilioClient,
};

export function createExpressHandler(serverlessFunction: ServerlessFunction) {
  return (req: Request, res: Response) => {
    console.log(req.body, context)
    serverlessFunction(context, req.body, (_, serverlessResponse) => {
      const { statusCode, headers, body } = serverlessResponse;

      res
        .status(statusCode)
        .set(headers)
        .json(body);
    });
  };
}

export async function twilioNotification(serverlessFunction: ServerlessFunction) {
  // console.log("test")
  try {

    // await twilioClient.notify.v1.services('IS370b45527f4b4cbb8ea1608d2cd4de62')
    //   .bindings
    //   .create({
    //      identity: 'identity',
    //      bindingType: 'apn',
    //      address: 'address'
    //    })
    //   .then(binding => console.log(binding.sid));
     await twilioClient.notify.v1.services('IS370b45527f4b4cbb8ea1608d2cd4de62')
      .notifications
      .create({body: 'Hello Bob', identity: ['identity']})
      .then(notification => console.log(notification));
  } catch (error) {
    throw error
  }
}