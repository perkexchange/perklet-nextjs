exports.up = async function (sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY NOT NULL,
        invoice_id CHARACTER VARYING(255),
        ticket_id CHARACTER VARYING(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE,
        paid_at TIMESTAMP WITH TIME ZONE,
        activated_at TIMESTAMP WITH TIME ZONE
    )
  `;
};

exports.down = async function (sql) {
  await sql`
    DROP TABLE IF EXISTS tickets
  `;
};
