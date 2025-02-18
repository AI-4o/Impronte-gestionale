import { Pool } from "pg";
import {
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
  PreventivoAlClienteRow,
  Banca,
  PreventivoAlCliente,
} from "./definitions";
import {
  ClienteInputGroup,
  PreventivoInputGroup,
} from "../dashboard/(overview)/general-interface/general-interface.defs";
import { DBResult } from "./actions/actions";
const pool = new Pool({
  connectionString: process.env.POSTGRESS_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const ITEMS_PER_PAGE = 50;

// #### 'LIKE' FILTERED LIST ####
export const fetchFilteredClienti = async (
  query: string,
  currentPage: number
): Promise<DBResult<ClienteInputGroup>> => {
  //console.log("fetchFilteredClienti", query, currentPage);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const clienti = await pool.query<Cliente>(
      `SELECT * FROM clienti 
      WHERE 
        nome ILIKE $1 OR 
        cognome ILIKE $1 OR 
        tel ILIKE $1 OR 
        email ILIKE $1 OR 
        tipo ILIKE $1 OR 
        provenienza ILIKE $1 OR 
        collegato ILIKE $1 OR 
        citta ILIKE $1 OR 
        note ILIKE $1 OR 
        indirizzo ILIKE $1 OR 
        CAP ILIKE $1 OR 
        CF ILIKE $1 OR 
        data_di_nascita::text ILIKE $1
      ORDER BY nome ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );

    return { values: clienti.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredDestinazioni = async (
  query: string,
  currentPage: number
): Promise<DBResult<Destinazione>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const destinazioni = await pool.query<Destinazione>(
      `SELECT * FROM destinazioni 
      WHERE nome ILIKE $1
      ORDER BY nome ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: destinazioni.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredFornitori = async (
  query: string,
  currentPage: number
): Promise<DBResult<Fornitore>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const fornitori = await pool.query<Fornitore>(
      `SELECT * FROM fornitori 
      WHERE nome ILIKE $1 OR valuta ILIKE $1
      ORDER BY nome ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: fornitori.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredPreventivi = async (
  query: string,
  currentPage: number
): Promise<DBResult<Preventivo>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const preventivi = await pool.query<Preventivo>(
      `SELECT * FROM preventivi 
      WHERE 
        email ILIKE $1 OR
        numero_di_telefono ILIKE $1 OR
        note ILIKE $1 OR
        riferimento ILIKE $1 OR
        operatore ILIKE $1 OR
        feedback ILIKE $1 OR
        stato ILIKE $1 OR
        numero_preventivo ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: preventivi.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredServiziATerra = async (
  query: string,
  currentPage: number
): Promise<DBResult<ServizioATerra>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const serviziATerra = await pool.query<ServizioATerra>(
      `SELECT * FROM servizi_a_terra 
      WHERE descrizione ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: serviziATerra.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredVoli = async (
  query: string,
  currentPage: number
): Promise<DBResult<Volo>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const voli = await pool.query<Volo>(
      `SELECT * FROM voli 
      WHERE compagnia_aerea ILIKE $1 OR descrizione ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: voli.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredAssicurazioni = async (
  query: string,
  currentPage: number
): Promise<DBResult<Assicurazione>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const assicurazioni = await pool.query<Assicurazione>(
      `SELECT * FROM assicurazioni 
      WHERE assicurazione ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: assicurazioni.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredPreventiviMostrareCliente = async (
  query: string,
  currentPage: number
): Promise<DBResult<PreventivoAlClienteRow>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const preventiviMostrareCliente = await pool.query<PreventivoAlClienteRow>(
      `SELECT * FROM preventivi_mostrare_clienti 
      WHERE descrizione ILIKE $1 OR tipo ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return {
      values: preventiviMostrareCliente.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredPartecipanti = async (
  query: string,
  currentPage: number
): Promise<DBResult<Partecipante>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const partecipanti = await pool.query<Partecipante>(
      `SELECT * FROM partecipanti 
      WHERE nome ILIKE $1 OR cognome ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: partecipanti.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredIncassiPartecipanti = async (
  query: string,
  currentPage: number
): Promise<DBResult<IncassoPartecipante>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const incassiPartecipanti = await pool.query<IncassoPartecipante>(
      `SELECT * FROM incassi_partecipanti 
      WHERE 
        id_partecipante::text ILIKE $1 OR
        id_banca::text ILIKE $1 OR
        importo::text ILIKE $1 OR
        data_scadenza::text ILIKE $1 OR
        data_incasso::text ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return {
      values: incassiPartecipanti.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredPagamentiServiziATerra = async (
  query: string,
  currentPage: number
): Promise<DBResult<PagamentoServizioATerra>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiServiziATerra = await pool.query<PagamentoServizioATerra>(
      `SELECT * FROM pagamenti_servizi_a_terra 
      WHERE 
        id_servizio_a_terra::text ILIKE $1 OR
        id_banca::text ILIKE $1 OR
        importo::text ILIKE $1 OR
        data_scadenza::text ILIKE $1 OR
        data_incasso::text ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return {
      values: pagamentiServiziATerra.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredPagamentiVoli = async (
  query: string,
  currentPage: number
): Promise<DBResult<PagamentoVolo>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiVoli = await pool.query<PagamentoVolo>(
      `SELECT * FROM pagamenti_voli 
      WHERE 
        id_volo::text ILIKE $1 OR
        id_banca::text ILIKE $1 OR
        importo::text ILIKE $1 OR
        data_scadenza::text ILIKE $1 OR
        data_incasso::text ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: pagamentiVoli.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredPagamentiAssicurazioni = async (
  query: string,
  currentPage: number
): Promise<DBResult<PagamentoAssicurazione>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiAssicurazioni = await pool.query<PagamentoAssicurazione>(
      `SELECT * FROM pagamenti_assicurazioni 
      WHERE 
        id_assicurazione::text ILIKE $1 OR
        id_banca::text ILIKE $1 OR
        importo::text ILIKE $1 OR
        data_scadenza::text ILIKE $1 OR
        data_incasso::text ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return {
      values: pagamentiAssicurazioni.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFilteredPratiche = async (
  query: string,
  currentPage: number
): Promise<DBResult<Pratica>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pratiche = await pool.query<Pratica>(
      `SELECT * FROM pratiche 
      WHERE 
        id_cliente::text ILIKE $1 OR
        id_preventivo::text ILIKE $1 OR
        data_conferma::text ILIKE $1 OR
        data_partenza::text ILIKE $1 OR
        data_rientro::text ILIKE $1 OR
        note::text ILIKE $1 OR
        numero_passeggeri::text ILIKE $1 OR
        totale::text ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return { values: pratiche.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};

// #### PAGINATION ####
export async function fetchClientiPages(query: string): Promise<number> {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM clienti
      WHERE nome ILIKE $1 OR cognome ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of clienti.", error);
  }
}
export async function fetchDestinazioniPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM destinazioni
      WHERE nome ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of destinazioni.", error);
  }
}
export async function fetchFornitoriPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM fornitori
      WHERE nome ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of fornitori.", error);
  }
}
export async function fetchPratichePages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM pratiche
      WHERE numero ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of pratiche.", error);
  }
}
export async function fetchPreventiviPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM preventivi
      WHERE numero_preventivo ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of preventivi.", error);
  }
}
export async function fetchServiziATerraPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM servizi_a_terra
      WHERE descrizione ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of servizi a terra.", error);
  }
}
export async function fetchVoliPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM voli
      WHERE descrizione ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of voli.", error);
  }
}
export async function fetchAssicurazioniPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM assicurazioni
      WHERE assicurazione ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of assicurazioni.", error);
  }
}
export async function fetchPagamentiAssicurazioniPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM pagamenti_assicurazioni
      WHERE numero ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch total number of pagamenti assicurazioni.",
      error
    );
  }
}
export async function fetchPreventiviClientiPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM preventivi_mostrare_clienti
      WHERE descrizione ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch total number of preventivi clienti.",
      error
    );
  }
}
export async function fetchPartecipantiPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM partecipanti
      WHERE nome ILIKE $1 OR cognome ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of partecipanti.", error);
  }
}
export async function fetchIncassiPartecipantiPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM incassi_partecipanti
      WHERE numero ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch total number of incassi partecipanti.",
      error
    );
  }
}
export async function fetchPagamentiServiziATerraPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM pagamenti_servizi_a_terra
      WHERE numero ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch total number of pagamenti servizi a terra.",
      error
    );
  }
}
export async function fetchPagamentiVoliPages(query: string) {
  try {
    const count = await pool.query(
      `SELECT COUNT(*)
      FROM pagamenti_voli
      WHERE numero ILIKE $1`,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of pagamenti voli.", error);
  }
}

// #### FETCH BY ID ####
export const fetchClienteById = async (
  id: string
): Promise<DBResult<Cliente>> => {
  try {
    const cliente = await pool.query<Cliente>(
      `SELECT * FROM clienti
      WHERE id = $1`,
      [id]
    );
    return { values: cliente.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchDestinazioneById = async (
  id: string
): Promise<DBResult<Destinazione>> => {
  try {
    const destinazione = await pool.query<Destinazione>(
      `SELECT * FROM destinazioni
      WHERE id = $1`,
      [id]
    );
    return { values: destinazione.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFornitoreById = async (
  id: string
): Promise<DBResult<Fornitore>> => {
  try {
    const fornitore = await pool.query<Fornitore>(
      `SELECT * FROM fornitori
      WHERE id = $1`,
      [id]
    );
    return { values: fornitore.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchPraticaById = async (
  id: string
): Promise<DBResult<Pratica>> => {
  try {
    const pratica = await pool.query<Pratica>(
      `SELECT * FROM pratiche
      WHERE id = $1`,
      [id]
    );
    return { values: pratica.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchPreventivoById = async (
  id: string
): Promise<DBResult<Preventivo>> => {
  try {
    const preventivo = await pool.query<Preventivo>(
      `SELECT * FROM preventivi
      WHERE id = $1`,
      [id]
    );
    return { values: preventivo.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchIncassoPartecipanteById = async (
  id: string
): Promise<DBResult<IncassoPartecipante>> => {
  try {
    const incassoPartecipante = await pool.query<IncassoPartecipante>(
      `SELECT * FROM incassi_partecipanti
      WHERE id = $1`,
      [id]
    );
    return {
      values: incassoPartecipante.rows[0],
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchPagamentoServizioATerraById = async (
  id: string
): Promise<DBResult<PagamentoServizioATerra>> => {
  try {
    const pagamentoServizioATerra = await pool.query<PagamentoServizioATerra>(
      `SELECT * FROM pagamenti_servizi_a_terra
      WHERE id = $1`,
      [id]
    );
    return {
      values: pagamentoServizioATerra.rows[0],
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchPagamentoVoloById = async (
  id: string
): Promise<DBResult<PagamentoVolo>> => {
  try {
    const pagamentoVolo = await pool.query<PagamentoVolo>(
      `SELECT * FROM pagamenti_voli
      WHERE id = $1`,
      [id]
    );
    return { values: pagamentoVolo.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchBancaById = async (id: string): Promise<DBResult<Banca>> => {
  try {
    const banca = await pool.query<Banca>(
      `SELECT * FROM banche
      WHERE id = $1`,
      [id]
    );
    return { values: banca.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchPagamentoAssicurazioneById = async (
  id: string
): Promise<DBResult<PagamentoAssicurazione>> => {
  try {
    const pagamentoAssicurazione = await pool.query<PagamentoAssicurazione>(
      `SELECT * FROM pagamenti_assicurazioni
      WHERE id = $1`,
      [id]
    );
    return {
      values: pagamentoAssicurazione.rows[0],
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchPreventivoMostrareClienteById = async (
  id: string
): Promise<DBResult<PreventivoAlClienteRow>> => {
  try {
    const preventivoMostrareCliente = await pool.query<PreventivoAlClienteRow>(
      `SELECT * FROM preventivo_mostrare_cliente
      WHERE id = $1`,
      [id]
    );
    return {
      values: preventivoMostrareCliente.rows[0],
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchPartecipanteById = async (
  id: string
): Promise<DBResult<Partecipante>> => {
  try {
    const partecipante = await pool.query<Partecipante>(
      `SELECT * FROM partecipanti
      WHERE id = $1`,
      [id]
    );
    return { values: partecipante.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchServizioATerraById = async (
  id: string
): Promise<DBResult<ServizioATerra>> => {
  try {
    const servizioATerra = await pool.query<ServizioATerra>(
      `SELECT * FROM servizi_a_terra
      WHERE id = $1`,
      [id]
    );
    return { values: servizioATerra.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchVoloById = async (id: string): Promise<DBResult<Volo>> => {
  try {
    const volo = await pool.query<Volo>(
      `
      SELECT * FROM voli
      WHERE id = $1`,
      [id]
    );
    return { values: volo.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchAssicurazioneById = async (
  id: string
): Promise<DBResult<Assicurazione>> => {
  try {
    const assicurazione = await pool.query<Assicurazione>(
      `SELECT * FROM assicurazioni
      WHERE id = $1`,
      [id]
    );
    return { values: assicurazione.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};

// #### FETCH BY DEPENDENCY ####
export const fetchPreventiviByIdCliente = async (
  idCliente: string
): Promise<DBResult<PreventivoInputGroup[]>> => {
  try {
    const preventivo = await pool.query<Preventivo>(
      `SELECT * FROM preventivi
      WHERE id_cliente = $1`,
      [idCliente]
    );
    return {
      values: preventivo.rows.map(
        (p) =>
          new PreventivoInputGroup(
            p.numero_preventivo,
            p.percentuale_ricarico,
            p.brand,
            p.riferimento,
            p.operatore,
            p.feedback,
            p.note,
            p.adulti,
            p.bambini,
            p.data_partenza,
            p.data,
            p.stato as "da fare" | "in trattativa" | "confermato" | "inviato",
            p.id
          )
      ),
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchDestinazioneByName = async (
  name: string
): Promise<DBResult<Destinazione>> => {
  try {
    const destinazione = await pool.query<Destinazione>(
      `SELECT * FROM destinazioni
      WHERE nome = $1`,
      [name]
    );
    return { values: destinazione.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchFornitoreByName = async (
  name: string
): Promise<DBResult<Fornitore>> => {
  try {
    const fornitore = await pool.query<Fornitore>(
      `SELECT * FROM fornitori
      WHERE nome = $1`,
      [name]
    );
    return { values: fornitore.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const getFornitoreByName = async (
  name: string
): Promise<DBResult<Fornitore>> => {
  try {
    const fornitore = await pool.query<Fornitore>(
      `SELECT * FROM fornitori
          WHERE nome = $1`,
      [name]
    );
    return { values: fornitore.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};

// #### FETCH BY PREVENTIVO ####

export const fetchServiziATerraByPreventivoId = async (
  idPreventivo: string
): Promise<DBResult<ServizioATerra[]>> => {
  try {
    const serviziATerra = await pool.query<ServizioATerra>(
      `SELECT * FROM servizi_a_terra
      WHERE id_preventivo = $1 AND servizio_aggiuntivo = false`,
      [idPreventivo]
    );
    return {
      values: serviziATerra.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchServiziAggiuntiviByPreventivoId = async (
  idPreventivo: string
): Promise<DBResult<ServizioATerra[]>> => {
  try {
    const serviziAggiuntivi = await pool.query<ServizioATerra>(
      `SELECT * FROM servizi_a_terra
      WHERE id_preventivo = $1 AND servizio_aggiuntivo = true`,
      [idPreventivo]
    );
    return {
      values: serviziAggiuntivi.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchVoliByPreventivoId = async (
  idPreventivo: string
): Promise<DBResult<Volo[]>> => {
  try {
    const voli = await pool.query<Volo>(
      `SELECT * FROM voli
      WHERE id_preventivo = $1`,
      [idPreventivo]
    );
    return {
      values: voli.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};
export const fetchAssicurazioniByPreventivoId = async (
  idPreventivo: string
): Promise<DBResult<Assicurazione[]>> => {
  try {
    const assicurazioni = await pool.query<Assicurazione>(
      `SELECT * FROM assicurazioni
      WHERE id_preventivo = $1`,
      [idPreventivo]
    );
    return {
      values: assicurazioni.rows,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};

export const getNumberOfPreventivi = async (): Promise<DBResult<number>> => {
  try {
    const preventivi = await pool.query(`SELECT COUNT(*) FROM preventivi;`);
    return {
      values: preventivi.rows[0].count,
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errorsMessage: error,
    };
  }
};

// #### FETCH ALL ####

export const fetchAllFornitori = async (): Promise<DBResult<Fornitore[]>> => {
  try {
    const fornitori = await pool.query<Fornitore>(`SELECT * FROM fornitori`);
    return { values: fornitori.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, errorsMessage: error };
  }
};

export const fetchAllBanche = async (): Promise<DBResult<Banca[]>> => {
  try {
    const banche = await pool.query<Banca>(`SELECT * FROM banche`);
    return { values: banche.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, errorsMessage: error };
  }
};

export const fetchAllDestinazioni = async (): Promise<
  DBResult<Destinazione[]>
> => {
  try {
    const destinazioni = await pool.query<Destinazione>(
      `SELECT * FROM destinazioni`
    );
    return { values: destinazioni.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, errorsMessage: error };
  }
};

export const fetchAllPreventiviWithCliente = async (): Promise<
  DBResult<(Preventivo & { cliente: Cliente })[]>
> => {
  try {
    const preventivi = await pool.query(`
      SELECT 
        p.*,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.cognome as cliente_cognome,
        c.tel as cliente_tel,
        c.email as cliente_email,
        c.tipo as cliente_tipo,
        c.provenienza as cliente_provenienza,
        c.collegato as cliente_collegato,
        c.citta as cliente_citta,
        c.note as cliente_note,
        c.indirizzo as cliente_indirizzo,
        c.CAP as cliente_cap,
        c.CF as cliente_cf,
        c.data_di_nascita as cliente_data_di_nascita
      FROM preventivi p
      LEFT JOIN clienti c ON p.id_cliente = c.id
      ORDER BY p.data DESC
    `);

    const preventiviWithCliente = preventivi.rows.map((row) => {
      const cliente: Cliente = {
        id: row.cliente_id,
        nome: row.cliente_nome,
        cognome: row.cliente_cognome,
        tel: row.cliente_tel,
        email: row.cliente_email,
        tipo: row.cliente_tipo,
        provenienza: row.cliente_provenienza,
        collegato: row.cliente_collegato,
        citta: row.cliente_citta,
        note: row.cliente_note,
        indirizzo: row.cliente_indirizzo,
        cap: row.cliente_cap,
        cf: row.cliente_cf,
        data_di_nascita: row.cliente_data_di_nascita,
      };

      // Remove cliente_ prefixed fields and create the preventivo object
      const preventivo = Object.fromEntries(
        Object.entries(row).filter(([key]) => !key.startsWith("cliente_"))
      ) as unknown as Preventivo;

      return {
        ...preventivo,
        cliente,
      };
    });

    return { values: preventiviWithCliente, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, errorsMessage: error };
  }
};

export const fetchPreventivoAlClienteByPreventivoId = async (
  idPreventivo: string
): Promise<DBResult<PreventivoAlCliente>> => {
  try {
    const preventivoAlClienteQR = await pool.query<PreventivoAlCliente>(
      `SELECT * FROM preventivi_al_cliente
      WHERE id_preventivo = $1`,
      [idPreventivo]
    );
    console.log("preventivoAlClienteQR: ", preventivoAlClienteQR.rows[0]);
    const id = preventivoAlClienteQR.rows[0].id;
    const preventivoAlClienteRowQR = await pool.query<PreventivoAlClienteRow>(
      `SELECT * FROM preventivi_al_cliente_row
      WHERE id_preventivo_al_cliente = $1`,
      [id]
    );
    const preventivoAlCliente = preventivoAlClienteQR.rows[0];
    preventivoAlCliente.righePrimoTipo = preventivoAlClienteRowQR.rows.filter(
      (row) => row.senza_assicurazione === true
    );
    preventivoAlCliente.righeSecondoTipo = preventivoAlClienteRowQR.rows.filter(
      (row) => row.senza_assicurazione === false
    );
    return { values: preventivoAlCliente, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, errorsMessage: error };
  }
};

export const fetchAllClienti = async (): Promise<DBResult<Cliente[]>> => {
  try {
    const clienti = await pool.query<Cliente>(`SELECT * FROM clienti`);
    console.log(clienti.rows);

    return { values: clienti.rows, success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, errorsMessage: error };
  }
};
