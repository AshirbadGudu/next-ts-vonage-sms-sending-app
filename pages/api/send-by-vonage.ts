import Vonage from "@vonage/server-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req;

  if (method === "GET") return res.json({ message: "NEXT TS SMS API" });
  if (method === "POST") {
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY || "",
      apiSecret: process.env.VONAGE_API_SECRET || "",
    });

    vonage.message.sendSms(
      "NEXT TS SMS API",
      body.phoneNumber,
      body.message,
      {},
      (err, smsResponse) => {
        if (err) {
          console.log("err", err);
          return res.status(500).json({
            error: "Something went wrong",
          });
        }
        console.log("smsResponse", smsResponse);
        if (smsResponse.messages[0]["status"] === "0")
          return res.status(200).json({ message: "SMS sent successfully" });
        return res.status(500).json({ error: "Message failed to sent" });
      }
    );
  }
}
