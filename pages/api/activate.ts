// pages/api/new_ticket.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { SessionOptions, SessionData } from "../../lib/session";
import { type Ticket } from "../../lib/tickets";
import { getTickets, activateTicket } from "../../lib/tickets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ticket } = req.body;
    const session = await getIronSession<SessionData>(req, res, SessionOptions);
    if (typeof ticket === "string") {
      let now = new Date();
      let existingTickets: Ticket[] = await getTickets(ticket);
      if (existingTickets.length == 1) {
        let existingTicket = existingTickets[0];
        if (!existingTicket.paid_at) {
          res.status(403).json({ message: "Ticket is unpaid." });
          return;
        }
        let expires = new Date();
        let activatedAt = new Date();
        if (existingTicket.activated_at) {
          activatedAt = new Date(existingTicket.activated_at);
        } else {
          activateTicket(ticket);
        }
        session.ticket = existingTicket.ticket_id;
        session.activatedAt = activatedAt.toISOString();

        expires.setMinutes(activatedAt.getMinutes() + 30); // Session limit
        session.endsAt = expires.toISOString();
        await session.save();

        if (now > expires) {
          res.status(403).json({
            text: "Ticket has expired.",
            ticket: session.ticket,
            expiresAt: session.endsAt,
            valid: now < expires,
          });
        } else {
          res.status(200).json({
            text: "Ticket is activated.",
            ticket: session.ticket,
            expiresAt: session.endsAt,
            valid: now < expires,
          });
        }
      } else {
        res.status(404).json({ message: "No such ticket." });
      }
    }
    res.status(400).json({ message: "Invalid ticket." });
  } else {
    // Handle non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
