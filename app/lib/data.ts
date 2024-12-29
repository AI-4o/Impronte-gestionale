import { sql } from '@vercel/postgres';
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
  PreventivoMostrareCliente,
  Banca
} from './definitions';
import { ClienteInputGroup, PreventivoInputGroup } from '../dashboard/(overview)/general-interface/general-interface.defs';
import { DBResult } from './actions/actions';

const ITEMS_PER_PAGE = 50;

// #### 'LIKE' FILTERED LIST ####
export const 

fetchFilteredClienti = async (
  query: string,
  currentPage: number,
): Promise<DBResult<ClienteInputGroup>> => {
  //console.log("fetchFilteredClienti", query, currentPage);
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
        indirizzo ILIKE ${`%${query}%`} OR 
        CAP ILIKE ${`%${query}%`} OR 
        CF ILIKE ${`%${query}%`} OR 
        data_di_nascita::text ILIKE ${`%${query}%`}
      ORDER BY nome ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    
    return {values: clienti.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredDestinazioni = async (
  query: string,
  currentPage: number,
): Promise<DBResult<Destinazione>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const destinazioni = await sql<Destinazione>`
      SELECT * FROM destinazioni 
      WHERE 
        nome ILIKE ${`%${query}%`}
      ORDER BY nome ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return {values: destinazioni.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
   return {
    success: false,
    errorsMessage: error
   }
  }
};
export const fetchFilteredFornitori = async (
  query: string,
  currentPage: number,
): Promise<DBResult<Fornitore>> => {
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
    return {values: fornitori.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredPreventivi = async (
  query: string,
  currentPage: number,
): Promise<DBResult<Preventivo>> => {
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
    return {values: preventivi.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredServiziATerra = async (
  query: string,
  currentPage: number,
): Promise<DBResult<ServizioATerra>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const serviziATerra = await sql<ServizioATerra>`
      SELECT * FROM servizi_a_terra 
      WHERE 
        descrizione ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return {values: serviziATerra.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredVoli = async (
  query: string,
  currentPage: number,
): Promise<DBResult<Volo>> => {
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
    return {values: voli.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredAssicurazioni = async (
  query: string,
  currentPage: number,
): Promise<DBResult<Assicurazione>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const assicurazioni = await sql<Assicurazione>`
      SELECT * FROM assicurazioni 
      WHERE 
        assicurazione ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return {values: assicurazioni.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredPreventiviMostrareCliente = async (
  query: string,
  currentPage: number,
): Promise<DBResult<PreventivoMostrareCliente>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const preventiviMostrareCliente = await sql<PreventivoMostrareCliente>`
      SELECT * FROM preventivi_mostrare_clienti 
      WHERE 
        descrizione ILIKE ${`%${query}%`} OR
        tipo ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return {values: preventiviMostrareCliente.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredPartecipanti = async (
  query: string,
  currentPage: number,
): Promise<DBResult<Partecipante>> => {
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
    return {values: partecipanti.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredIncassiPartecipanti = async (
  query: string,
  currentPage: number,
): Promise<DBResult<IncassoPartecipante>> => {
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
    return {values: incassiPartecipanti.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredPagamentiServiziATerra = async (
  query: string,
  currentPage: number,
): Promise<DBResult<PagamentoServizioATerra>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiServiziATerra = await sql<PagamentoServizioATerra>`
      SELECT * FROM pagamenti_servizi_a_terra 
      WHERE 
        id_servizio_a_terra::text ILIKE ${`%${query}%`} OR
        id_banca::text ILIKE ${`%${query}%`} OR
        importo::text ILIKE ${`%${query}%`} OR
        data_scadenza::text ILIKE ${`%${query}%`} OR
        data_incasso::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return {values: pagamentiServiziATerra.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredPagamentiVoli = async (
  query: string,
  currentPage: number,
): Promise<DBResult<PagamentoVolo>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiVoli = await sql<PagamentoVolo>`
      SELECT * FROM pagamenti_voli 
      WHERE 
        id_volo::text ILIKE ${`%${query}%`} OR
        id_banca::text ILIKE ${`%${query}%`} OR
        importo::text ILIKE ${`%${query}%`} OR
        data_scadenza::text ILIKE ${`%${query}%`} OR
        data_incasso::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return {values: pagamentiVoli.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredPagamentiAssicurazioni = async (
  query: string,
  currentPage: number,
): Promise<DBResult<PagamentoAssicurazione>> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pagamentiAssicurazioni = await sql<PagamentoAssicurazione>`
      SELECT * FROM pagamenti_assicurazioni 
      WHERE 
        id_assicurazione::text ILIKE ${`%${query}%`} OR
        id_banca::text ILIKE ${`%${query}%`} OR
        importo::text ILIKE ${`%${query}%`} OR
        data_scadenza::text ILIKE ${`%${query}%`} OR
        data_incasso::text ILIKE ${`%${query}%`}
      ORDER BY id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return {values: pagamentiAssicurazioni.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};
export const fetchFilteredPratiche = async (
  query: string,
  currentPage: number,
): Promise<DBResult<Pratica>> => {
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
    return {values: pratiche.rows, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    }
  }
};

// #### PAGINATION ####
export async function fetchClientiPages(query: string): Promise<number> {
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
      indirizzo ILIKE ${`%${query}%`} OR
      CAP ILIKE ${`%${query}%`} OR
      CF ILIKE ${`%${query}%`} OR
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
      servizio_aggiuntivo::text ILIKE ${`%${query}%`}
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
    FROM preventivi_mostrare_clienti
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

// #### FETCH BY ID ####
export const fetchClienteById = async (id: string): Promise<DBResult<Cliente> > => {
  try {
    const cliente = await sql<Cliente>`
      SELECT * FROM clienti
      WHERE id = ${id}
    `;
    return {values: cliente.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchDestinazioneById = async (id: string): Promise<DBResult<Destinazione> > => {
  try {
    const destinazione = await sql<Destinazione>`
      SELECT * FROM destinazioni
      WHERE id = ${id}
    `;
    return {values: destinazione.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchFornitoreById = async (id: string): Promise<DBResult<Fornitore> > => {
  try {
    const fornitore = await sql<Fornitore>`
      SELECT * FROM fornitori
      WHERE id = ${id}
    `;
    return {values: fornitore.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchPraticaById = async (id: string): Promise<DBResult<Pratica> > => {
  try {
    const pratica = await sql<Pratica>`
      SELECT * FROM pratiche
      WHERE id = ${id}
    `;
    return {values: pratica.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchPreventivoById = async (id: string): Promise<DBResult<Preventivo> > => {
  try {
    const preventivo = await sql<Preventivo>`
      SELECT * FROM preventivi
      WHERE id = ${id}
    `;
    return {values: preventivo.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchIncassoPartecipanteById = async (id: string): Promise<DBResult<IncassoPartecipante> > => {
  try {
    const incassoPartecipante = await sql<IncassoPartecipante>`
      SELECT * FROM incassi_partecipanti
      WHERE id = ${id}
    `;
    return {values: incassoPartecipante.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchPagamentoServizioATerraById = async (id: string): Promise<DBResult<PagamentoServizioATerra> > => {
  try {
    const pagamentoServizioATerra = await sql<PagamentoServizioATerra>`
      SELECT * FROM pagamenti_servizi_a_terra
      WHERE id = ${id}
    `;
    return {values: pagamentoServizioATerra.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchPagamentoVoloById = async (id: string): Promise<DBResult<PagamentoVolo> > => {
  try {
    const pagamentoVolo = await sql<PagamentoVolo>`
      SELECT * FROM pagamenti_voli
      WHERE id = ${id}
    `;
    return {values: pagamentoVolo.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchBancaById = async (id: string): Promise<DBResult<Banca> > => {
  try {
    const banca = await sql<Banca>`
      SELECT * FROM banche
      WHERE id = ${id}
    `;
    return {values: banca.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchPagamentoAssicurazioneById = async (id: string): Promise<DBResult<PagamentoAssicurazione> > => {
  try {
    const pagamentoAssicurazione = await sql<PagamentoAssicurazione>`
      SELECT * FROM pagamenti_assicurazioni
      WHERE id = ${id}
    `;
    return {values: pagamentoAssicurazione.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchPreventivoMostrareClienteById = async (id: string): Promise<DBResult<PreventivoMostrareCliente> > => {
  try {
    const preventivoMostrareCliente = await sql<PreventivoMostrareCliente>`
      SELECT * FROM preventivo_mostrare_cliente
      WHERE id = ${id}
    `;
    return {values: preventivoMostrareCliente.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchPartecipanteById = async (id: string): Promise<DBResult<Partecipante> > => {
  try {
    const partecipante = await sql<Partecipante>`
      SELECT * FROM partecipanti
      WHERE id = ${id}
    `;
    return {values: partecipante.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchServizioATerraById = async (id: string): Promise<DBResult<ServizioATerra> > => {
  try {
    const servizioATerra = await sql<ServizioATerra>`
      SELECT * FROM servizi_a_terra
      WHERE id = ${id}
    `;
    return {values: servizioATerra.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchVoloById = async (id: string): Promise<DBResult<Volo> > => {
  try {
    const volo = await sql<Volo>`
      SELECT * FROM voli
      WHERE id = ${id}
    `;
    return {values: volo.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchAssicurazioneById = async (id: string): Promise<DBResult<Assicurazione> > => {
  try {
    const assicurazione = await sql<Assicurazione>`
      SELECT * FROM assicurazioni
      WHERE id = ${id}
    `;
    return {values: assicurazione.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};

// #### FETCH BY DEPENDENCY ####
export const fetchPreventiviByIdCliente = async (idCliente: string): Promise<DBResult<PreventivoInputGroup[]> > => {
  try {
    const preventivo = await sql<Preventivo>`
      SELECT * FROM preventivi
      WHERE id_cliente = ${idCliente}
    `;
    return {
      values: preventivo.rows.map(p => new PreventivoInputGroup(p.numero_preventivo, p.brand, p.riferimento, p.operatore, p.feedback, p.note, p.adulti, p.bambini, p.data_partenza, p.data, p.stato as 'da fare' | 'in trattativa' | 'confermato' | 'inviato', p.id)),
      success: true,
      errorsMessage: ''
    }
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchDestinazioneByName = async (name: string): Promise<DBResult<Destinazione> > => {
  try {
    const destinazione = await sql<Destinazione>`
      SELECT * FROM destinazioni
      WHERE nome = ${name}
    `;
    return {values: destinazione.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const fetchFornitoreByName = async (name: string): Promise<DBResult<Fornitore> > => {
  try {
    const fornitore = await sql<Fornitore>`
      SELECT * FROM fornitori
      WHERE nome = ${name}
    `;
    return {values: fornitore.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
};
export const getFornitoreByName = async (name: string): Promise<DBResult<Fornitore> > => {
      try {
        const fornitore = await sql<Fornitore>`
          SELECT * FROM fornitori
          WHERE nome = ${name}
        `;
        return {values: fornitore.rows[0], success: true, errorsMessage: ''};
      } catch (error) {
        console.error('Database Error:', error);
        return {
          success: false,
          errorsMessage: error
        };
      }
};

// #### FETCH BY PREVENTIVO ####

export const fetchServiziATerraByPreventivoId = async (idPreventivo: string): Promise<DBResult<ServizioATerra[]> > => {
  try {
    const serviziATerra = await sql<ServizioATerra>`
      SELECT * FROM servizi_a_terra
      WHERE id_preventivo = ${idPreventivo}
    `;
    return {
      values: serviziATerra.rows,
      success: true,
      errorsMessage: ''
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
}
export const fetchServiziAggiuntiviByPreventivoId = async (idPreventivo: string): Promise<DBResult<ServizioATerra[]> > => {
  try {
    const serviziAggiuntivi = await sql<ServizioATerra>`
      SELECT * FROM servizi_a_terra
      WHERE id_preventivo = ${idPreventivo} AND servizio_aggiuntivo = true
    `;
    return {
      values: serviziAggiuntivi.rows,
      success: true,
      errorsMessage: ''
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
}
export const fetchVoliByPreventivoId = async (idPreventivo: string): Promise<DBResult<Volo[]> > => {
  try {
    const voli = await sql<Volo>`
      SELECT * FROM voli
      WHERE id_preventivo = ${idPreventivo}
    `;
    return {
      values: voli.rows,
      success: true,
      errorsMessage: ''
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
}
export const fetchAssicurazioniByPreventivoId = async (idPreventivo: string): Promise<DBResult<Assicurazione[]> > => {
  try {
    const assicurazioni = await sql<Assicurazione>`
      SELECT * FROM assicurazioni
      WHERE id_preventivo = ${idPreventivo}
    `;
    return {
      values: assicurazioni.rows,
      success: true,
      errorsMessage: ''
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
}

export const getNumberOfPreventivi = async (): Promise<DBResult<number> > => {
  try {
    const preventivi = await sql`
      SELECT COUNT(*) FROM preventivi;
    `;
    return {values: preventivi.rows[0].count, success: true, errorsMessage: ''};
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      errorsMessage: error
    };
  }
}