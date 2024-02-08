import crypto from "crypto";
import sql from "./db";

export interface Ticket {
  id: number;
  invoice_id: string;
  ticket_id: string;
  created_at: Date;
  paid_at: Date;
  activated_at: Date;
}

function generateRandomString(length: number): string {
  const buffer = crypto.randomBytes(length);
  return buffer.toString("hex");
}

export async function getTickets(orderId: string) {
  return await sql<Ticket[]>`
    SELECT id, invoice_id, ticket_id, created_at, paid_at, activated_at FROM tickets
    WHERE ticket_id=${orderId} ORDER BY id
  `;
}

export async function createTicketFromInvoice(invoiceId: string) {
  const ticketId = generateRandomString(32);
  return await sql<Ticket[]>`
    INSERT INTO tickets (ticket_id, created_at, invoice_id) VALUES (${ticketId}, ${Date()}, ${invoiceId})
    RETURNING id, invoice_id, ticket_id, paid_at, created_at, activated_at
  `;
}
export async function createTicket() {
  const ticketId = generateRandomString(32);
  return await sql<Ticket[]>`
    INSERT INTO tickets (ticket_id, created_at) VALUES (${ticketId}, ${Date()})
    RETURNING id, invoice_id, ticket_id, paid_at, created_at, activated_at
  `;
}

export async function assignInvoice(ticketId: string, invoiceId: string) {
  return await sql<Ticket[]>`
    UPDATE tickets SET invoice_id=${invoiceId} WHERE ticket_id=${ticketId}
    RETURNING id, invoice_id, ticket_id, paid_at, created_at, activated_at
  `;
}

export async function activateTicket(ticketId: string) {
  return await sql<Ticket[]>`
    UPDATE tickets SET activated_at= ${Date()} WHERE ticket_id=${ticketId}
    RETURNING id, invoice_id, ticket_id, paid_at, created_at, activated_at
  `;
}

export async function markTicketPaid(invoiceId: string, paidAt: Date) {
  return await sql<Ticket[]>`
    UPDATE tickets SET paid_at=${paidAt} WHERE invoice_id=${invoiceId}
    RETURNING id, invoice_id, ticket_id, paid_at, created_at, activated_at
  `;
}
