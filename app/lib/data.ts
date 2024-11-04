import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTableRow,
  LatestInvoiceRaw,
  Revenue,
  Cliente,
  Preventivo,
  Pratica,
  Destinazione,
  Assicurazione,
  Fornitore,
  IncassoPartecipante,
  PagamentoAssicurazione,
  PagamentoServizioATerra,
  PagamentoVolo,
  Partecipante,
  ServizioATerra,
  Volo,
  PreventivoMostrareCliente,
  Banca,
  EntityList
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}
export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
const ITEMS_PER_PAGE = 20;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTableRow>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}
export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}
export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}



// #### 'LIKE' FILTERED LIST FUNCTIONS ####
export const fetchFilteredClienti = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const clienti = await sql<Cliente>`
      SELECT * FROM clienti 
      WHERE 
        nome ILIKE ${`%${query}%`} OR 
        cognome ILIKE ${`%${query}%`} OR 
        tel ILIKE ${`%${query}%`} OR 
        email ILIKE ${`%${query}%`} OR 
        tipo ILIKE ${`%${query}%`} OR 
        provenienza ILIKE ${`%${query}%`} OR 
        collegato ILIKE ${`%${query}%`} OR 
        citta ILIKE ${`%${query}%`} OR 
        note ILIKE ${`%${query}%`} OR 
        data_di_nascita::text ILIKE ${`%${query}%`}
      ORDER BY nome ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return clienti.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clienti.');
  }
};
export const fetchFilteredDestinazioni = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const destinazioni = await sql<Destinazione>`
      SELECT * FROM destinazioni 
      WHERE 
        nome ILIKE ${`%${query}%`}
      ORDER BY nome ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return destinazioni.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch destinazioni.');
  }
};
export const fetchFilteredFornitori = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const fornitori = await sql<Fornitore>`
      SELECT * FROM fornitori 
      WHERE 
        nome ILIKE ${`%${query}%`} OR
        valuta ILIKE ${`%${query}%`}
      ORDER BY nome ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return fornitori.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fornitori.');
  }
};
export const fetchFilteredPreventivi = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const preventivi = await sql<Preventivo>`
      SELECT * FROM preventivi 
      WHERE 
        email ILIKE ${`%${query}%`} OR
        numero_di_telefono ILIKE ${`%${query}%`} OR
        note ILIKE ${`%${query}%`} OR
        riferimento ILIKE ${`%${query}%`} OR
        operatore ILIKE ${`%${query}%`} OR
        feedback ILIKE ${`%${query}%`} OR
        stato ILIKE ${`%${query}%`} OR
        numero_preventivo ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return preventivi.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch preventivi.');
  }
};
export const fetchFilteredServiziATerra = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const serviziATerra = await sql<ServizioATerra>`
      SELECT * FROM servizi_a_terra 
      WHERE 
        descrizione ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return serviziATerra.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch servizi a terra.');
  }
};
export const fetchFilteredVoli = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const voli = await sql<Volo>`
      SELECT * FROM voli 
      WHERE 
        compagnia_aerea ILIKE ${`%${query}%`} OR
        descrizione ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return voli.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch voli.');
  }
};
export const fetchFilteredAssicurazioni = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const assicurazioni = await sql<Assicurazione>`
      SELECT * FROM assicurazioni 
      WHERE 
        assicurazione ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return assicurazioni.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch assicurazioni.');
  }
};
export const fetchFilteredPreventiviMostrareCliente = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const preventiviMostrareCliente = await sql<PreventivoMostrareCliente>`
      SELECT * FROM preventivo_mostrare_cliente 
      WHERE 
        descrizione ILIKE ${`%${query}%`} OR
        tipo ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return preventiviMostrareCliente.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch preventivi mostrare cliente.');
  }
};
export const fetchFilteredPartecipanti = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const partecipanti = await sql<Partecipante>`
      SELECT * FROM partecipanti 
      WHERE 
        nome ILIKE ${`%${query}%`} OR
        cognome ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return partecipanti.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch partecipanti.');
  }
};
export const fetchFilteredIncassiPartecipanti = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const incassiPartecipanti = await sql<IncassoPartecipante>`
      SELECT * FROM incassi_partecipanti 
      WHERE 
        id_partecipante::text ILIKE ${`%${query}%`} OR
        id_banca::text ILIKE ${`%${query}%`} OR
        importo::text ILIKE ${`%${query}%`} OR
        data_scadenza::text ILIKE ${`%${query}%`} OR
        data_incasso::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return incassiPartecipanti.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch incassi partecipanti.');
  }
};
export const fetchFilteredPagamentiServiziATerra = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiServiziATerra = await sql<PagamentoServizioATerra>`
      SELECT * FROM pagamenti_servizi_a_terra 
      WHERE 
        id_fornitore::text ILIKE ${`%${query}%`} OR
        id_servizio_a_terra::text ILIKE ${`%${query}%`} OR
        id_banca::text ILIKE ${`%${query}%`} OR
        importo::text ILIKE ${`%${query}%`} OR
        data_scadenza::text ILIKE ${`%${query}%`} OR
        data_incasso::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return pagamentiServiziATerra.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pagamenti servizi a terra.');
  }
};
export const fetchFilteredPagamentiVoli = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiVoli = await sql<PagamentoVolo>`
      SELECT * FROM pagamenti_voli 
      WHERE 
        id_fornitore::text ILIKE ${`%${query}%`} OR
        id_volo::text ILIKE ${`%${query}%`} OR
        id_banca::text ILIKE ${`%${query}%`} OR
        importo::text ILIKE ${`%${query}%`} OR
        data_scadenza::text ILIKE ${`%${query}%`} OR
        data_incasso::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return pagamentiVoli.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pagamenti voli.');
  }
};
export const fetchFilteredPagamentiAssicurazioni = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiAssicurazioni = await sql<PagamentoAssicurazione>`
      SELECT * FROM pagamenti_assicurazioni 
      WHERE 
        id_fornitore::text ILIKE ${`%${query}%`} OR
        id_assicurazione::text ILIKE ${`%${query}%`} OR
        id_banca::text ILIKE ${`%${query}%`} OR
        importo::text ILIKE ${`%${query}%`} OR
        data_scadenza::text ILIKE ${`%${query}%`} OR
        data_incasso::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return pagamentiAssicurazioni.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pagamenti assicurazioni.');
  }
};
export const fetchFilteredPratiche = async (
  query: string,
  currentPage: number,
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pratiche = await sql<Pratica>`
      SELECT * FROM pratiche 
      WHERE 
        id_cliente::text ILIKE ${`%${query}%`} OR
        id_preventivo::text ILIKE ${`%${query}%`} OR
        data_conferma::text ILIKE ${`%${query}%`} OR
        data_partenza::text ILIKE ${`%${query}%`} OR
        data_rientro::text ILIKE ${`%${query}%`} OR
        note::text ILIKE ${`%${query}%`} OR
        numero_passeggeri::text ILIKE ${`%${query}%`} OR
        totale::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return pratiche.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pratiche.');
  }
};


// #### PAGINATION FUNCTIONS ####
export async function fetchClientiPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM clienti
    WHERE
      nome ILIKE ${`%${query}%`} OR
      cognome ILIKE ${`%${query}%`} OR
      tel ILIKE ${`%${query}%`} OR
      email ILIKE ${`%${query}%`} OR
      tipo ILIKE ${`%${query}%`} OR
      provenienza ILIKE ${`%${query}%`} OR
      collegato ILIKE ${`%${query}%`} OR
      citta ILIKE ${`%${query}%`} OR
      note ILIKE ${`%${query}%`} OR
      data_di_nascita::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of clienti.', error);
  }
}
export async function fetchDestinazioniPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM destinazioni
    WHERE
      nome ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of destinazioni.', error);
  }
}
export async function fetchFornitoriPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM fornitori
    WHERE
      nome ILIKE ${`%${query}%`} OR
      valuta ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fornitori.', error);
  }
}
export async function fetchPratichePages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM pratiche
    WHERE
      id::text ILIKE ${`%${query}%`} OR
      data_conferma::text ILIKE ${`%${query}%`} OR
      data_partenza::text ILIKE ${`%${query}%`} OR
      data_rientro::text ILIKE ${`%${query}%`} OR
      numero_passeggeri::text ILIKE ${`%${query}%`} OR
      totale::text ILIKE ${`%${query}%`} OR
      note ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pratiche.', error);
  }
}
export async function fetchPreventiviPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM preventivi
    WHERE
      email ILIKE ${`%${query}%`} OR
      numero_di_telefono::text ILIKE ${`%${query}%`} OR
      note ILIKE ${`%${query}%`} OR
      adulti::text ILIKE ${`%${query}%`} OR
      bambini::text ILIKE ${`%${query}%`} OR
      riferimento ILIKE ${`%${query}%`} OR
      data_partenza::text ILIKE ${`%${query}%`} OR
      operatore ILIKE ${`%${query}%`} OR
      feedback ILIKE ${`%${query}%`} OR
      stato ILIKE ${`%${query}%`} OR
      data::text ILIKE ${`%${query}%`} OR
      numero_preventivo ILIKE ${`%${query}%`} OR
      confermato::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of preventivi.', error);
  }
}
export async function fetchServiziATerraPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM servizi_a_terra
    WHERE
      data::text ILIKE ${`%${query}%`} OR
      numero_notti::text ILIKE ${`%${query}%`} OR
      totale::text ILIKE ${`%${query}%`} OR
      valuta ILIKE ${`%${query}%`} OR
      cambio::text ILIKE ${`%${query}%`} OR
      ricarico::text ILIKE ${`%${query}%`} OR
      servizio_aggiuntivi::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of servizi a terra.', error);
  }
}
export async function fetchVoliPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM voli
    WHERE
      compagnia_aerea ILIKE ${`%${query}%`} OR
      descrizione ILIKE ${`%${query}%`} OR
      data_partenza::text ILIKE ${`%${query}%`} OR
      data_arrivo::text ILIKE ${`%${query}%`} OR
      totale::text ILIKE ${`%${query}%`} OR
      valuta ILIKE ${`%${query}%`} OR
      cambio::text ILIKE ${`%${query}%`} OR
      ricarico::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of voli.', error);
  }
}
export async function fetchAssicurazioniPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM assicurazioni
    WHERE
      assicurazione ILIKE ${`%${query}%`} OR
      netto::text ILIKE ${`%${query}%`} OR
      ricarico::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of assicurazioni.', error);
  }
}
export async function fetchPagamentiAssicurazioniPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM pagamenti_assicurazioni
    WHERE
      id::text ILIKE ${`%${query}%`} OR
      id_fornitore::text ILIKE ${`%${query}%`} OR
      id_assicurazione::text ILIKE ${`%${query}%`} OR
      banca ILIKE ${`%${query}%`} OR
      importo::text ILIKE ${`%${query}%`} OR
      data_scadenza::text ILIKE ${`%${query}%`} OR
      data_incasso::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pagamenti assicurazioni.', error);
  }
}
export async function fetchPreventiviClientiPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM preventivo_mostrare_cliente
    WHERE
      descrizione ILIKE ${`%${query}%`} OR
      tipo ILIKE ${`%${query}%`} OR
      costo_individuale::text ILIKE ${`%${query}%`} OR
      importo_vendita::text ILIKE ${`%${query}%`} OR
      totale::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of preventivi clienti.', error);
  }
}
export async function fetchPartecipantiPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM partecipanti
    WHERE
      id_preventivo::text ILIKE ${`%${query}%`} OR
      nome ILIKE ${`%${query}%`} OR
      cognome ILIKE ${`%${query}%`} OR
      tot_quota::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of partecipanti.', error);
  }
}
export async function fetchIncassiPartecipantiPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM incassi_partecipanti
    WHERE
      id_partecipante::text ILIKE ${`%${query}%`} OR
      id_banca::text ILIKE ${`%${query}%`} OR
      importo::text ILIKE ${`%${query}%`} OR
      data_scadenza::text ILIKE ${`%${query}%`} OR
      data_incasso::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of incassi partecipanti.', error);
  }
}
export async function fetchPagamentiServiziATerraPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM pagamenti_servizi_a_terra
    WHERE
      id::text ILIKE ${`%${query}%`} OR
      id_fornitore::text ILIKE ${`%${query}%`} OR
      id_servizio_a_terra::text ILIKE ${`%${query}%`} OR
      id_banca ILIKE ${`%${query}%`} OR
      importo::text ILIKE ${`%${query}%`} OR
      data_scadenza::text ILIKE ${`%${query}%`} OR
      data_incasso::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pagamenti servizi a terra.', error);
  }
}
export async function fetchPagamentiVoliPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM pagamenti_voli
    WHERE
      id::text ILIKE ${`%${query}%`} OR
      id_fornitore::text ILIKE ${`%${query}%`} OR
      id_volo::text ILIKE ${`%${query}%`} OR
      banca ILIKE ${`%${query}%`} OR
      importo::text ILIKE ${`%${query}%`} OR
      data_scadenza::text ILIKE ${`%${query}%`} OR
      data_incasso::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pagamenti voli.', error);
  }
}

// #### FETCH ALL ENTITIES FUNCTIONS ####
export const fetchAllClienti = async (): Promise<EntityList<Cliente>> => {
  try {
    const clienti = await sql<Cliente>`
      SELECT * FROM clienti
      ORDER BY nome ASC
    `;
    return {entityName: 'cliente', data: clienti.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all clienti.');
  }
};
export const fetchAllDestinazioni = async (): Promise<EntityList<Destinazione>  > => {
  try {
    const destinazioni = await sql<Destinazione>`
      SELECT * FROM destinazioni
      ORDER BY nome ASC
    `;
    return {entityName: 'destinazione', data: destinazioni.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all destinazioni.');
  }
};
export const fetchAllFornitori = async (): Promise<EntityList<Fornitore>> => {
  try {
    const fornitori = await sql<Fornitore>`
      SELECT * FROM fornitori
      ORDER BY nome ASC
    `;
    return {entityName: 'fornitore', data: fornitori.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all fornitori.');
  }
};
export const fetchAllPratiche = async (): Promise<EntityList<Pratica>> => {
  try {
    const pratiche = await sql<Pratica>`
      SELECT * FROM pratiche
      ORDER BY id ASC
    `;
    return {entityName: 'pratica', data: pratiche.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all pratiche.');
  }
};
export const fetchAllPreventivi = async (): Promise<EntityList<Preventivo>> => {
  try {
    const preventivi = await sql<Preventivo>`
      SELECT * FROM preventivi
      ORDER BY id ASC
    `;
    return {entityName: 'preventivo', data: preventivi.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all preventivi.');
  }
};
export const fetchAllServiziATerra = async (): Promise<EntityList<ServizioATerra>> => {
  try {
    const serviziATerra = await sql<ServizioATerra>`
      SELECT * FROM servizi_a_terra
      ORDER BY id ASC
    `;
    return {entityName: 'servizio_a_terra', data: serviziATerra.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all servizi a terra.');
  }
};
export const fetchAllVoli = async (): Promise<EntityList<Volo>> => {
  try {
    const voli = await sql<Volo>`
      SELECT * FROM voli
      ORDER BY id ASC
    `;
    return {entityName: 'volo', data: voli.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all voli.');
  }
};
export const fetchAllAssicurazioni = async (): Promise<EntityList<Assicurazione>> => {
  try {
    const assicurazioni = await sql<Assicurazione>`
      SELECT * FROM assicurazioni
      ORDER BY id ASC
    `;
    return {entityName: 'assicurazione', data: assicurazioni.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all assicurazioni.');
  }
};
export const fetchAllPagamentiAssicurazioni = async (): Promise<EntityList<PagamentoAssicurazione>> => {
  try {
    const pagamentiAssicurazioni = await sql<PagamentoAssicurazione>`
      SELECT * FROM pagamenti_assicurazioni
      ORDER BY id ASC
    `;
    return {entityName: 'pagamento_assicurazione', data: pagamentiAssicurazioni.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all pagamenti assicurazioni.');
  }
};
export const fetchAllPreventiviClienti = async (): Promise<EntityList<PreventivoMostrareCliente>> => {
  try {
    const preventiviClienti = await sql<PreventivoMostrareCliente>`
      SELECT * FROM preventivi_clienti
      ORDER BY id ASC
    `;
    return {entityName: 'preventivo_cliente', data: preventiviClienti.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all preventivi clienti.');
  }
};
export const fetchAllPartecipanti = async (): Promise<EntityList<Partecipante>> => {
  try {
    const partecipanti = await sql<Partecipante>`
      SELECT * FROM partecipanti
      ORDER BY id ASC
    `;
    return {entityName: 'partecipante', data: partecipanti.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all partecipanti.');
  }
};
export const fetchAllIncassiPartecipanti = async (): Promise<EntityList<IncassoPartecipante>> => {
  try {
    const incassiPartecipanti = await sql<IncassoPartecipante>`
      SELECT * FROM incassi_partecipanti
      ORDER BY id ASC
    `;
    return {entityName: 'incasso_partecipante', data: incassiPartecipanti.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all incassi partecipanti.');
  }
};
export const fetchAllPagamentiServiziATerra = async (): Promise<EntityList<PagamentoServizioATerra>> => {
  try {
    const pagamentiServiziATerra = await sql<PagamentoServizioATerra>`
      SELECT * FROM pagamenti_servizi_a_terra
      ORDER BY id ASC
    `;
    return {entityName: 'pagamento_servizi_a_terra', data: pagamentiServiziATerra.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all pagamenti servizi a terra.');
  }
};
export const fetchAllPagamentiVoli = async (): Promise<EntityList<PagamentoVolo>> => {
  try {
    const pagamentiVoli = await sql<PagamentoVolo>`
      SELECT * FROM pagamenti_voli
      ORDER BY id ASC
    `;
    return {entityName: 'pagamento_voli', data: pagamentiVoli.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all pagamenti voli.');
  }
};
export const fetchAllBanche = async (): Promise<EntityList<Banca>> => {
  try {
    const banche = await sql<Banca>`
      SELECT * FROM banche
      ORDER BY id ASC
    `;
    return {entityName: 'banca', data: banche.rows};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all banche.');
  }
};

// #### FETCH ENTITY BY ID FUNCTIONS ####
export const fetchClienteById = async (id: string): Promise<Cliente | null> => {
  try {
    const cliente = await sql<Cliente>`
      SELECT * FROM clienti
      WHERE id = ${id}
    `;
    return cliente.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch cliente by id.');
  }
};
export const fetchDestinazioneById = async (id: string): Promise<Destinazione | null> => {
  try {
    const destinazione = await sql<Destinazione>`
      SELECT * FROM destinazioni
      WHERE id = ${id}
    `;
    return destinazione.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch destinazione by id.');
  }
};
export const fetchFornitoreById = async (id: string): Promise<Fornitore | null> => {
  try {
    const fornitore = await sql<Fornitore>`
      SELECT * FROM fornitori
      WHERE id = ${id}
    `;
    return fornitore.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fornitore by id.');
  }
};
export const fetchPraticaById = async (id: string): Promise<Pratica | null> => {
  try {
    const pratica = await sql<Pratica>`
      SELECT * FROM pratiche
      WHERE id = ${id}
    `;
    return pratica.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pratica by id.');
  }
};
export const fetchPreventivoById = async (id: string): Promise<Preventivo | null> => {
  try {
    const preventivo = await sql<Preventivo>`
      SELECT * FROM preventivi
      WHERE id = ${id}
    `;
    return preventivo.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch preventivo by id.');
  }
};
export const fetchIncassoPartecipanteById = async (id: string): Promise<IncassoPartecipante | null> => {
  try {
    const incassoPartecipante = await sql<IncassoPartecipante>`
      SELECT * FROM incassi_partecipanti
      WHERE id = ${id}
    `;
    return incassoPartecipante.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch incasso partecipante by id.');
  }
};
export const fetchPagamentoServizioATerraById = async (id: string): Promise<PagamentoServizioATerra | null> => {
  try {
    const pagamentoServizioATerra = await sql<PagamentoServizioATerra>`
      SELECT * FROM pagamenti_servizi_a_terra
      WHERE id = ${id}
    `;
    return pagamentoServizioATerra.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pagamento servizio a terra by id.');
  }
};
export const fetchPagamentoVoloById = async (id: string): Promise<PagamentoVolo | null> => {
  try {
    const pagamentoVolo = await sql<PagamentoVolo>`
      SELECT * FROM pagamenti_voli
      WHERE id = ${id}
    `;
    return pagamentoVolo.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pagamento volo by id.');
  }
};
export const fetchBancaById = async (id: string): Promise<Banca | null> => {
  try {
    const banca = await sql<Banca>`
      SELECT * FROM banche
      WHERE id = ${id}
    `;
    return banca.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch banca by id.');
  }
};
export const fetchPagamentoAssicurazioneById = async (id: string): Promise<PagamentoAssicurazione | null> => {
  try {
    const pagamentoAssicurazione = await sql<PagamentoAssicurazione>`
      SELECT * FROM pagamenti_assicurazioni
      WHERE id = ${id}
    `;
    return pagamentoAssicurazione.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pagamento assicurazione by id.');
  }
};
export const fetchPreventivoMostrareClienteById = async (id: string): Promise<PreventivoMostrareCliente | null> => {
  try {
    const preventivoMostrareCliente = await sql<PreventivoMostrareCliente>`
      SELECT * FROM preventivo_mostrare_cliente
      WHERE id = ${id}
    `;
    return preventivoMostrareCliente.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch preventivo mostrare cliente by id.');
  }
};
export const fetchPartecipanteById = async (id: string): Promise<Partecipante | null> => {
  try {
    const partecipante = await sql<Partecipante>`
      SELECT * FROM partecipanti
      WHERE id = ${id}
    `;
    return partecipante.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch partecipante by id.');
  }
};
export const fetchServizioATerraById = async (id: string): Promise<ServizioATerra | null> => {
  try {
    const servizioATerra = await sql<ServizioATerra>`
      SELECT * FROM servizi_a_terra
      WHERE id = ${id}
    `;
    return servizioATerra.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch servizio a terra by id.');
  }
};
export const fetchVoloById = async (id: string): Promise<Volo | null> => {
  try {
    const volo = await sql<Volo>`
      SELECT * FROM voli
      WHERE id = ${id}
    `;
    return volo.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch volo by id.');
  }
};
export const fetchAssicurazioneById = async (id: string): Promise<Assicurazione | null> => {
  try {
    const assicurazione = await sql<Assicurazione>`
      SELECT * FROM assicurazioni
      WHERE id = ${id}
    `;
    return assicurazione.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch assicurazione by id.');
  }
};