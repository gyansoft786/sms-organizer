import * as dotenv from "dotenv";
import * as twilio from "twilio";


import { BaseRoute } from "../routes/route";
import { NextFunction, Request, Response, Router } from "express";
import { Guards } from "../util/guards"


export class TwilioClient {
    
    private sendingNumber: string | undefined; // cant tell at compile time that this will be undefined or not.
    private client: any;

    constructor() {
        dotenv.config();
        let accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
        let authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;
        this.sendingNumber = process.env.TWILIO_PHONE_NUMBER;
        
        this.client = twilio(accountSid, authToken);
    }

    public sendSMS( to: string, message: string){
        
        return this.client.api.messages.create({
            body: message,
            to: to,
            from: this.sendingNumber,
        }).then(function(data: any) {
            console.log('Message sent');
        }).catch(function(err: any) {
            console.error('Could not send message');
            console.error(err);
        });
    }
}

