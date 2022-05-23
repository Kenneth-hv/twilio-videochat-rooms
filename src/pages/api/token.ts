import type { NextApiRequest, NextApiResponse } from "next";
import { jwt } from "twilio";
import { config as dotenv } from "dotenv";
dotenv();

const CONFIG = {
  ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ?? "",
  API_KEY: process.env.TWILIO_API_KEY ?? "",
  API_SECRET: process.env.TWILIO_API_SECRET ?? "",
};

interface Response {
  token: string;
}

interface ErrorResponse {
  error: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | ErrorResponse>
) {
  const identity = req.query.identity;
  const room = req.query.room;

  if (!identity) {
    res.status(400).json({ error: "Missing parameter 'identity'" });
    return;
  }

  if (!room) {
    res.status(400).json({ error: "Missing parameter 'room'" });
    return;
  }

  if (typeof identity !== "string" || identity === "") {
    res.status(400).json({ error: "Invalid 'identity'" });
    return;
  }

  if (typeof room !== "string" || identity === "") {
    res.status(400).json({ error: "Invalid 'room'" });
    return;
  }

  const token = new jwt.AccessToken(
    CONFIG.ACCOUNT_SID,
    CONFIG.API_KEY,
    CONFIG.API_SECRET,
    { ttl: 14400, identity }
  );

  const videoGrant = new jwt.AccessToken.VideoGrant({
    room,
  });
  const chatGrant = new jwt.AccessToken.ChatGrant();
  token.addGrant(videoGrant);
  token.addGrant(chatGrant);

  res.status(200).json({ token: token.toJwt() });
}
