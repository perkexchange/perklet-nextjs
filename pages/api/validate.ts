// pages/api/new_ticket.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { SessionOptions, SessionData } from "../../lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getIronSession<SessionData>(req, res, SessionOptions);
    const expiredDate = new Date(session.endsAt);
    const now = new Date();
    res.status(200).json({
      ticket: session.ticket,
      expires: session.endsAt,
      valid: now < expiredDate,
    });
  } else {
    // Handle non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
