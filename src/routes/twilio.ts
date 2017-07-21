import { BaseRoute } from "../routes/route";
import { TwilioClient } from "../twilio/twilioClient";
import { NextFunction, Request, Response, Router } from "express";
import * as twilio from "twilio";
const MessagingResponse = require('twilio').twiml.MessagingResponse; // the typed library is ass, this will have to do.
import { container } from "../dependencyInjection/inversifyConfig";
import { IDENTIFIER_TOKEN } from "../dependencyInjection/identifierToken";
import { UserStore } from "../users/userStore";
import { User } from "../users/user";
import { UserStoreFactory} from "../users/userStoreFactory";

import { AwaitingConfirmation } from "../twilio/twilioStateMachine";

export class TwilioRoute extends BaseRoute {

  public static create(router: Router) {
    console.log("[TwilioRoute::create] Creating twilio route.");

    router.post("/sms", (req: Request, res: Response, next: NextFunction) => {
        new TwilioRoute().handleMessage(req,res,next);
    });
  }

  constructor() {
      super();
  }

private handleMessage(req: Request, res: Response, next: NextFunction) {
  // Look up the user via their number.
  const userStore: UserStore = container.get<UserStore>(IDENTIFIER_TOKEN.USER_STORE);
  // const userStoreFactory: UserStoreFactory = container.get<UserStoreFactory>(IDENTIFIER_TOKEN.USER_STORE_FACTORY);
//   let userStore = UserStoreFactory.defaultUserStore();

  // User should have a state machine associated with them.
  let requestingNumber = req.body.From;
  let requestingMessage = req.body.Body
  let sessionUser: User = userStore.getUserByNumber(requestingNumber).unwrap_or( () => {
    return new User ("new","user",requestingNumber);
  });
  console.log(`Message recieved from ${requestingNumber}, this maps to user: ${sessionUser.fullName}`);
    
  const response: Promise<string> = sessionUser.processInput(requestingMessage);
  response.then((message: string) => {
    console.log(`Response: ${message}`);

    const twiml = new MessagingResponse();
    twiml.message(message);

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });

  }
}