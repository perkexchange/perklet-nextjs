// pages/api/new_ticket.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { type Ticket } from "../../lib/tickets";
import { createTicket, assignInvoice, markTicketPaid } from "../../lib/tickets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await markTicketPaid(
      req.body.invoice_id,
      req.body.order_id, // order_id == ticket_id
      req.body.paid_at
    );

    try {
      const tickets: Ticket[] = await createTicket();
      const ticketId = tickets[0].ticket_id;

      const invoice = {
        paid_url: `${process.env.PERKLET_URL}/?ticket=${ticketId}`,
        currency: process.env.PERKLET_INVOICE_CURRENCY,
        order_id: ticketId,
        amount: process.env.PERKLET_INVOICE_AMOUNT,
        memo: process.env.PERKLET_INVOICE_MEMO,
        url_callback: `${process.env.PERKLET_URL}/api/invoice_paid`,
      };
      const externalApiResponse = await axios.post(
        `${process.env.PERK_EXCHANGE_URL}/api/invoices`,
        invoice,
        {
          headers: {
            Authorization: `Bearer ${process.env.PERK_EXCHANGE_API_TOKEN}`,
          },
        }
      );

      // Extract the invoice_id from the external API response
      const invoiceId = externalApiResponse.data.invoice_id;

      // Call the assignInvoice function with the invoiceId and orderId
      await assignInvoice(ticketId, invoiceId);

      // Respond to the request indicating success
      res.status(200).json({ message: "Ticket processed successfully" });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
