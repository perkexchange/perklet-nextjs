// pages/api/new_ticket.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { type Ticket } from "../../lib/tickets";
import { markTicketPaid, assignInvoice } from "../../lib/tickets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const externalApiResponse = await axios.get(
      `${process.env.PERK_EXCHANGE_URL}/api/invoices/${req.body.invoice_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PERK_EXCHANGE_API_TOKEN}`,
        },
      }
    );

    // Extract the invoice_id from the external API response
    const paid_at = externalApiResponse.data.paid_at;

    await markTicketPaid(req.body.invoice_id, paid_at);
    res.status(200).json({ message: "Invoice assigned" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
