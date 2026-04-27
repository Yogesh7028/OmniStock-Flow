const https = require("https");
const querystring = require("querystring");

const sendTwilioMessage = ({ phone, message }) =>
  new Promise((resolve, reject) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    const payload = {
      To: phone,
      Body: message,
      ...(messagingServiceSid ? { MessagingServiceSid: messagingServiceSid } : { From: from }),
    };
    const body = querystring.stringify(payload);
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const request = https.request(
      {
        hostname: "api.twilio.com",
        path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (error) {
            parsed = { raw: data };
          }

          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve({ sent: true, provider: "twilio", sid: parsed.sid });
            return;
          }

          reject(new Error(parsed.message || "Twilio SMS delivery failed"));
        });
      }
    );

    request.on("error", reject);
    request.write(body);
    request.end();
  });

const sendSMS = async ({ phone, message }) => {
  const hasTwilioConfig =
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    (process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID);

  if (!hasTwilioConfig) {
    return { skipped: true, reason: "Twilio SMS is not configured" };
  }

  return sendTwilioMessage({ phone, message });
};

module.exports = sendSMS;
