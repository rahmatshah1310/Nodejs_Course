const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "invoice_db",
  password: "swatkpk@123",
  port: 5432,
});

async function getInvoices() {
  const res = await pool.query(`
    SELECT invoices.id, customers.name AS customer, invoices.invoice_date, invoices.due_date, invoices.status, invoices.total_amount
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
  `);
  console.log(res.rows);
}

getInvoices();
