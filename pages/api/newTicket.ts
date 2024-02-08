// pages/api/new_ticket.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { type Ticket } from "../../lib/tickets";
import { createTicketFromInvoice, assignInvoice } from "../../lib/tickets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.headers.authorization !==
    `Bearer ${process.env.PERK_EXCHANGE_API_TOKEN}`
  ) {
    res.status(401).end({ message: "Unauthorized" });
    return;
  }
  if (req.method === "POST") {
    try {
      const tickets: Ticket[] = await createTicketFromInvoice(
        req.body.invoice_id
      );
      res.status(200).json({ ticket: tickets[0].ticket_id });
    } catch (error) {
      console.error(error);
      res.status(500).end({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
