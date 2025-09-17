// services/twilioService.js
import twilio from "twilio";
import {config} from 'dotenv'
config() ;

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const twilioPhone = process.env.TWILIO_PHONE; // Your Twilio number

const client = twilio(accountSid, authToken);

/**
 * Send SMS via Twilio
 * @param {string} to - Recipient phone number in E.164 format (e.g., +919876543210)
 * @param {string} body - The message text
 */
export const sendSMS = async (to, body) => {
  
  try {
    // agar phone number +91 se start nahi hota to auto add kardo
    if (to && to.trim() && !to.startsWith("+91")) {
      to = "+91" + to;
    }
    console.log(to , ":" , body)
    // const message = await client.messages.create({
    //   body,
    //   from: twilioPhone,
    //   to,
    // });
  
    return //message; // returns Twilio message object
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};


