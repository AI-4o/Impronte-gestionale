"use server"; // IMPORTANTE: server actions devono essere precedute da 'use server' altrimenti bisogna dichiararlo per ciascuna!!

import { z } from "zod";
import { Pool } from "pg";
import { signIn, signOut } from "../../../auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { Cliente } from "../definitions";
import * as schemas from "./entity-zod-schemas";
import {
  fetchFilteredClienti,
  fetchFornitoreByName,
  fetchDestinazioneByName,
  getFornitoreByName,
  fetchAllFornitori,
  fetchAllBanche,
  fetchAllDestinazioni,
  fetchAllClienti,
} from "../data";
import {
  AssicurazioneInputGroup,
  ClienteInputGroup, 
  Data,
  ERRORMESSAGE,
  PreventivoInputGroup,
  ServizioATerraInputGroup,
  VoloInputGroup,
  PreventivoAlClienteInputGroup,
  PreventivoAlClienteRow,
} from "@/app/dashboard/(overview)/general-interface/general-interface.defs";
import { formatDate } from "../utils";
import path from "path";
import fs from "fs";

// Add this helper function at the top level, after the imports
const sanitizeString = (str: string): string => {
  if (!str) return str;
  return str.replace(/[\uFFFD\uD800-\uDFFF\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F\u0080-\u009F\u2000-\u2FFF]/g, '')
    .replace(/[\u0080-\u009F\u00A0-\u00FF]/g, ''); // Remove additional non-UTF8 characters
};

const pool = new Pool({
  connectionString: process.env.POSTGRESS_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export type DBResult<A> = {
  success: boolean;
  values?: any; // TODO: successivo refactoring si rende di tipo A | A[] | null
  errors?: Partial<TransformToStringArray<A>>;
  errorsMessage?: string;
};

// Utility type to transform properties into string[]
export type TransformToStringArray<T> = {
  [K in keyof T]: string[];
};
export type State<A> = {
  message?: string;
  values?: Partial<A>;
  errors?: Partial<TransformToStringArray<A>>;
  dbError?: string;
};

// CREATE

export const createCliente = async (
  c: ClienteInputGroup
): Promise<DBResult<ClienteInputGroup>> => {
  const parsedData = schemas.ClienteSchema.safeParse({
    email: c.email,
    nome: c.nome,
    cognome: c.cognome,
    note: c.note,
    tipo: c.tipo,
    data_di_nascita: formatDate(c.data_di_nascita),
    indirizzo: c.indirizzo,
    cap: c.cap,
    citta: c.citta,
    cf: c.cf,
    collegato: c.collegato,
    provenienza: c.provenienza,
    tel: c.tel,
    luogo_nascita: c.luogo_nascita,
    provincia_nascita: c.provincia_nascita,
    numero_passaporto: c.numero_passaporto,
    data_scadenza_passaporto: formatDate(c.data_scadenza_passaporto),
    nazionalita: c.nazionalita,
    provincia: c.provincia,
    sesso: c.sesso
  });
  if (!parsedData.success) {
    console.error("Failed to create cliente due to a validation error.");
    return {
      success: false,
      errorsMessage: "Failed to create cliente due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await pool.query(
      `
    INSERT INTO clienti (
      nome, cognome, note, tipo, data_di_nascita, indirizzo, CAP, citta, CF, 
      collegato, provenienza, tel, email, luogo_nascita, provincia_nascita,
      numero_passaporto, data_scadenza_passaporto, nazionalita, provincia, sesso
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    RETURNING *
`,
      [
        parsedData.data.nome,
        parsedData.data.cognome,
        parsedData.data.note,
        parsedData.data.tipo,
        parsedData.data.data_di_nascita,
        parsedData.data.indirizzo,
        parsedData.data.cap,
        parsedData.data.citta,
        parsedData.data.cf,
        parsedData.data.collegato,
        parsedData.data.provenienza,
        parsedData.data.tel,
        parsedData.data.email,
        parsedData.data.luogo_nascita,
        parsedData.data.provincia_nascita,
        parsedData.data.numero_passaporto,
        parsedData.data.data_scadenza_passaporto,
        parsedData.data.nazionalita,
        parsedData.data.provincia,
        parsedData.data.sesso
      ]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in createCliente: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in createCliente: " + error,
      values: parsedData.data,
      errors: {},
    };
  }
};

export const createPreventivo = async (
  p: PreventivoInputGroup,
  c: ClienteInputGroup,
  idCliente: string
): Promise<DBResult<PreventivoInputGroup>> => {
  const parsedData = schemas.PreventivoSchema.safeParse({
    id_cliente: idCliente,
    note: p.note,
    percentuale_ricarico: p.percentuale_ricarico,
    brand: p.brand,
    riferimento: p.riferimento,
    operatore: p.operatore,
    feedback: p.feedback,
    adulti: p.adulti,
    bambini: p.bambini,
    data_partenza: p.data_partenza,
    data: p.data,
    numero_preventivo: p.numero_preventivo,
    stato: p.stato,
    tipo_viaggio: p.tipo_viaggio,
    destinazione: p.destinazione
  });
  if (!parsedData.success) {
    console.error("Failed to Create Preventivo due to a validation error.");
    return {
      success: false,
      errorsMessage: "Failed to Create Preventivo due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await pool.query(
      `
    INSERT INTO preventivi (
      id_cliente, data, note, percentuale_ricarico, brand, riferimento, 
      operatore, feedback, adulti, bambini, data_partenza, numero_preventivo, 
      stato, tipo_viaggio, destinazione
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
`,
      [
        parsedData.data.id_cliente,
        parsedData.data.data,
        parsedData.data.note,
        parsedData.data.percentuale_ricarico,
        parsedData.data.brand,
        parsedData.data.riferimento,
        parsedData.data.operatore,
        parsedData.data.feedback,
        parsedData.data.adulti,
        parsedData.data.bambini,
        parsedData.data.data_partenza,
        parsedData.data.numero_preventivo,
        parsedData.data.stato,
        parsedData.data.tipo_viaggio,
        parsedData.data.destinazione
      ]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in createPreventivo: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in createPreventivo: " + error,
      values: parsedData.data,
    };
  }
};

export const createServizioATerra = async (
  s: ServizioATerraInputGroup,
  id_preventivo: string,
  servizio_aggiuntivo: boolean
): Promise<DBResult<ServizioATerraInputGroup>> => {
  let id_fornitore: string | null = null;
  let id_destinazione: string | null = null;
  if (s.fornitore) {
    const dbResultFornitore = await fetchFornitoreByName(s.fornitore);
    if (dbResultFornitore.success) {
      id_fornitore = dbResultFornitore.values.id;
    }
  }
  if (s.destinazione) {
    const dbResultDestinazione = await fetchDestinazioneByName(s.destinazione);
    if (dbResultDestinazione.success) {
      id_destinazione = dbResultDestinazione.values.id;
    }
  }

  const parsedData = schemas.ServizioATerraSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: id_fornitore,
    id_destinazione: id_destinazione,
    descrizione: sanitizeString(s.descrizione),
    data: s.data,
    numero_notti: s.numero_notti,
    numero_camere: s.numero_camere,
    totale: s.totale,
    valuta: s.valuta,
    cambio: s.cambio,
    servizio_aggiuntivo: servizio_aggiuntivo,
  });

  if (!parsedData.success) {
    console.error("Failed to Create servizioATerra due to a validation error.");
    return {
      success: false,
      errorsMessage:
        "Failed to Create servizioATerra due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await pool.query(
      `
    INSERT INTO servizi_a_terra (id_preventivo, id_fornitore, id_destinazione, descrizione, data, numero_notti, numero_camere, totale, valuta, cambio, servizio_aggiuntivo)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
`,
      [
        parsedData.data.id_preventivo,
        parsedData.data.id_fornitore,
        parsedData.data.id_destinazione,
        parsedData.data.descrizione,
        parsedData.data.data,
        parsedData.data.numero_notti,
        parsedData.data.numero_camere,
        parsedData.data.totale,
        parsedData.data.valuta,
        parsedData.data.cambio,
        parsedData.data.servizio_aggiuntivo,
      ]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in createServizioATerra: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in createServizioATerra: " + error,
      values: parsedData.data,
    };
  }
};

export const createVolo = async (
  v: VoloInputGroup,
  id_preventivo: string
): Promise<DBResult<VoloInputGroup>> => {
  const fornitore = await fetchFornitoreByName(v.fornitore);

  const parsedData = schemas.VoloSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: fornitore.values?.id,
    compagnia_aerea: v.compagnia_aerea,
    descrizione: v.descrizione,
    data_partenza: v.data_partenza,
    data_arrivo: v.data_arrivo,
    totale: v.totale,
    ricarico: v.ricarico,
    numero: v.numero,
    valuta: v.valuta,
    cambio: v.cambio,
  });

  if (!parsedData.success) {
    console.error("Failed to Create Volo due to a validation error.");
    return {
      success: false,
      errorsMessage: "Failed to Create Volo due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await pool.query(
      `
    INSERT INTO voli (id_preventivo, id_fornitore, compagnia_aerea, descrizione, data_partenza, data_arrivo, totale, ricarico, numero, valuta, cambio)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
`,
      [
        parsedData.data.id_preventivo,
        parsedData.data.id_fornitore,
        parsedData.data.compagnia_aerea,
        parsedData.data.descrizione,
        parsedData.data.data_partenza,
        parsedData.data.data_arrivo,
        parsedData.data.totale,
        parsedData.data.ricarico,
        parsedData.data.numero,
        parsedData.data.valuta,
        parsedData.data.cambio,
      ]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in Create Volo: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in Create Volo: " + error,
      values: parsedData.data,
    };
  }
};

export const createAssicurazione = async (
  a: AssicurazioneInputGroup,
  id_preventivo: string
): Promise<DBResult<AssicurazioneInputGroup>> => {
  const fornitore = await fetchFornitoreByName(a.fornitore);
  const parsedData = schemas.AssicurazioneSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: fornitore.values?.id,
    assicurazione: sanitizeString(a.assicurazione),
    netto: a.netto,
    ricarico: a.ricarico,
    numero: a.numero,
  });
  if (!parsedData.success) {
    console.error("Failed to Create Assicurazione due to a validation error.");
    return {
      success: false,
      errorsMessage:
        "Failed to Create Assicurazione due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  
  try {
    const result = await pool.query(
      `
    INSERT INTO assicurazioni (id_preventivo, id_fornitore, assicurazione, netto, ricarico, numero)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
`,
      [
        parsedData.data.id_preventivo,
        parsedData.data.id_fornitore,
        parsedData.data.assicurazione,
        parsedData.data.netto,
        parsedData.data.ricarico,
        parsedData.data.numero,
      ]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in createAssicurazione: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in createAssicurazione: " + error,
      values: parsedData.data,
    };
  }
};

export const createPreventivoAlCliente = async (
  p: PreventivoAlClienteInputGroup,
  id_preventivo: string
): Promise<DBResult<PreventivoAlClienteInputGroup>> => {
  const parsedData = schemas.PreventivoAlClienteSchema.safeParse({
    id_preventivo: id_preventivo,
    descrizione_viaggio: p.descrizione_viaggio,
  });

  if (!parsedData.success) {
    console.error(
      "Failed to create PreventivoAlCliente due to a validation error."
    );
    return {
      success: false,
      errorsMessage:
        "Failed to create PreventivoAlCliente due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const preventivoResult = await pool.query(
      `
    INSERT INTO preventivi_al_cliente (id_preventivo, descrizione_viaggio)
    VALUES ($1, $2)
    RETURNING *
`,
      [parsedData.data.id_preventivo, parsedData.data.descrizione_viaggio]
    );

    // creazione delle righe
    const rowFirstTypePromises = p.righePrimoTipo.map((row) =>
      createPreventivoAlClienteRow(row, true, preventivoResult.rows[0].id)
    );
    const rowSecondTypePromises = p.righeSecondoTipo.map((row) =>
      createPreventivoAlClienteRow(row, false, preventivoResult.rows[0].id)
    );

    const rowResults = await Promise.all(
      rowFirstTypePromises.concat(rowSecondTypePromises)
    )
      .then((results) => ({
        values: [preventivoResult.rows[0]].concat(results),
        success: true,
        errorsMessage: "",
      }))
      .catch((error) => {
        console.error(
          "Database Error in createPreventivoAlClienteRow: " + error
        );
        return {
          success: false,
          errorsMessage:
            "Database Error in createPreventivoAlClienteRow: " + error,
          values: preventivoResult.rows[0],
        };
      });
    return rowResults;
  } catch (error) {
    console.error("Database Error in createPreventivoAlCliente: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in createPreventivoAlCliente: " + error,
      values: parsedData.data,
    };
  }
};

export const createPreventivoAlClienteRow = async (
  p: PreventivoAlClienteRow,
  senzaAssicurazione: boolean,
  id_preventivo_al_cliente: string
): Promise<DBResult<PreventivoAlClienteRow>> => {
  const parsedData = schemas.PreventivoAlClienteRowSchema.safeParse({
    id_preventivo_al_cliente: id_preventivo_al_cliente,
    senza_assicurazione: senzaAssicurazione,
    destinazione: p.destinazione,
    descrizione: p.descrizione,
    individuale: p.individuale,
    numero: p.numero,
  });
  if (!parsedData.success) {
    console.error(
      "Failed to create PreventivoAlClienteRow due to a validation error."
    );
    return {
      success: false,
      errorsMessage:
        "Failed to create PreventivoAlClienteRow due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await pool.query(
      `
    INSERT INTO preventivi_al_cliente_row (id_preventivo_al_cliente, senza_assicurazione, destinazione, descrizione, individuale, numero)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
`,
      [
        parsedData.data.id_preventivo_al_cliente,
        parsedData.data.senza_assicurazione,
        parsedData.data.destinazione,
        parsedData.data.descrizione,
        parsedData.data.individuale,
        parsedData.data.numero,
      ]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in createPreventivoAlClienteRow: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in createPreventivoAlClienteRow: " + error,
      values: parsedData.data,
    };
  }
};

/**
 * Do the following:
 *
 * 1. check if the Cliente already exists -> if not, create cliente, if yes get cliente
 * 2. create preventivoCliente
 * 3. create each servizioATerra
 * 4. create each volo
 * 5. create each assicurazione
 * 6. return the preventivo, servizi, voli, assicurazioni inside a single object
 * @returns
 *
 */
export async function submitCreatePreventivoGI(
  data: Data
): Promise<DBResult<PreventivoInputGroup>> {
  try {
    let res = {
      preventivo: null,
      servizi: [],
      voli: [],
      assicurazioni: [],
      message: "",
      errorsMessage: "",
    };
    const resCreatePreventivo: DBResult<PreventivoInputGroup> =
      await createPreventivo(data.preventivo, data.cliente, data.cliente.id);
    let idPreventivo: string | undefined;

    // if error in createPreventivo, return error
    if (!resCreatePreventivo.success) {
      return resCreatePreventivo;
    } else {
      idPreventivo = resCreatePreventivo.values.id;
      res.preventivo = resCreatePreventivo.values;
    }
    // create serviziATerra
    const serviziATerraPromises = data.serviziATerra.map((s) =>
      createServizioATerra(s, idPreventivo, false)
    );
    const serviziAggiuntiviPromises = data.serviziAggiuntivi.map((s) =>
      createServizioATerra(s, idPreventivo, true)
    );
    const voliPromises = data.voli.map((v) => createVolo(v, idPreventivo));
    const assicurazioniPromises = data.assicurazioni.map((a) =>
      createAssicurazione(a, idPreventivo)
    );
    const preventivoAlClientePromises = data.preventivoAlCliente
      ? [createPreventivoAlCliente(data.preventivoAlCliente, idPreventivo)]
      : [];
    const results = await Promise.all([
      ...serviziATerraPromises,
      ...serviziAggiuntiviPromises,
      ...voliPromises,
      ...assicurazioniPromises,
      ...preventivoAlClientePromises,
    ])
      .then((results) => ({
        values: results,
        success: true,
        errorsMessage: "",
      }))
      .catch((error) => {
        console.error("Database Error in submitCreatePreventivoGI: " + error);
        return {
          success: false,
          errorsMessage: "Database Error in submitCreatePreventivoGI: " + error,
          values: res,
        };
      });
    return results;
  } catch (error) {
    console.error("Database Error in submitCreatePreventivoGI: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in submitCreatePreventivoGI: " + error,
    };
  }
}

export const addFundamentalEntity = async (
  tableName: string,
  value: string
): Promise<DBResult<any>> => {
  /**
   * destinazioni -> nome
   * banche -> nome
   * fornitori -> nome
   * permettere di aggiungere operatori, tipo cliente, provenienza cliente, brand richiede creazione dell'entity nel db
   */
  const parsedData = schemas.FundamentalEntitySchema.safeParse({
    tableName: tableName,
    value: value,
  });
  if (!parsedData.success) {
    console.error(
      "Failed to add Fundamental Entity due to a validation error."
    );
    return {
      success: false,
      errorsMessage:
        "Failed to add Fundamental Entity due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const query = `INSERT INTO ${parsedData.data.tableName} (nome) VALUES ($1) RETURNING *;`;
    const result = await pool.query(query, [parsedData.data.value]);
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in addFundamentalEntity: " + error);
    return {
      success: false,
      errorsMessage: "Database Error in addFundamentalEntity: " + error,
      values: parsedData.data,
      errors: {},
    };
  }
};

// ## GET DESTINAZIONE BY ID
export const getDestinazioneById = async (id_destinazione: string) => {
  try {
    const result = await pool.query(
      `SELECT * FROM destinazioni WHERE id = $1`,
      [id_destinazione]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in getDestinazioneById: " + error);
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error,
    };
  }
};
export const getFornitoreById = async (id_fornitore: string) => {
  try {
    const result = await pool.query(`SELECT * FROM fornitori WHERE id = $1`, [
      id_fornitore,
    ]);
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error in getFornitoreById: " + error);
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error,
    };
  }
};

// ### UPDATE ENTITY ###
export const updateCliente = async (
  c: ClienteInputGroup,
  id: string
): Promise<DBResult<ClienteInputGroup>> => {
  const parsedData = schemas.ClienteSchema.safeParse({
    id: id,
    nome: c.nome,
    cognome: c.cognome, 
    note: c.note,
    tipo: c.tipo,
    data_di_nascita: formatDate(c.data_di_nascita),
    tel: c.tel,
    email: c.email,
    citta: c.citta,
    collegato: c.collegato,
    provenienza: c.provenienza,
    indirizzo: c.indirizzo,
    cap: c.cap,
    cf: c.cf,
    luogo_nascita: c.luogo_nascita,
    provincia_nascita: c.provincia_nascita,
    numero_passaporto: c.numero_passaporto,
    data_scadenza_passaporto: formatDate(c.data_scadenza_passaporto),
    nazionalita: c.nazionalita,
    provincia: c.provincia,
    sesso: c.sesso
  });
  if (!parsedData.success) {
    console.error("Failed to Update Cliente due to a validation error.");
    return {
      success: false,
      errorsMessage: "Failed to Update Cliente due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    await pool.query(
      `
    UPDATE clienti
    SET nome = $1, 
        cognome = $2, 
        note = $3, 
        tipo = $4, 
        data_di_nascita = $5, 
        tel = $6, 
        email = $7, 
        citta = $8, 
        collegato = $9, 
        provenienza = $10, 
        indirizzo = $11, 
        CAP = $12, 
        CF = $13, 
        luogo_nascita = $14, 
        provincia_nascita = $15, 
        numero_passaporto = $16, 
        data_scadenza_passaporto = $17, 
        nazionalita = $18, 
        provincia = $19,
        sesso = $20
    WHERE id = $21
`,
      [
        parsedData.data.nome,
        parsedData.data.cognome,
        parsedData.data.note,
        parsedData.data.tipo,
        parsedData.data.data_di_nascita,
        parsedData.data.tel,
        parsedData.data.email,
        parsedData.data.citta,
        parsedData.data.collegato,
        parsedData.data.provenienza,
        parsedData.data.indirizzo,
        parsedData.data.cap,
        parsedData.data.cf,
        parsedData.data.luogo_nascita,
        parsedData.data.provincia_nascita,
        parsedData.data.numero_passaporto,
        parsedData.data.data_scadenza_passaporto,
        parsedData.data.nazionalita,
        parsedData.data.provincia,
        parsedData.data.sesso,
        id,
      ]
    );
    return {
      success: true,
      values: parsedData.data,
      errors: {},
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error: Failed to Update Cliente: " + error);
    return {
      success: false,
      errorsMessage: "Database Error: Failed to Update Cliente: " + error,
      values: parsedData.data,
      errors: {},
    };
  }
};

export const updatePreventivo = async (
  p: PreventivoInputGroup,
  idCliente: string
): Promise<DBResult<PreventivoInputGroup>> => {
  const parsedData = schemas.UpdatePreventivoSchema.safeParse({
    id: p.id,
    note: p.note,
    brand: p.brand,
    percentuale_ricarico: p.percentuale_ricarico,
    riferimento: p.riferimento,
    operatore: p.operatore,
    feedback: p.feedback,
    adulti: p.adulti,
    bambini: p.bambini,
    data_partenza: formatDate(p.data_partenza),
    data: formatDate(p.data),
    numero_preventivo: p.numero_preventivo,
    stato: p.stato,
    tipo_viaggio: p.tipo_viaggio,
    destinazione: p.destinazione
  });
  if (!parsedData.success) {
    console.error("Failed to Update Preventivo due to a validation error.");
    return {
      success: false,
      errorsMessage: "Failed to Update Preventivo due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await pool.query(
      `
    UPDATE preventivi SET 
    note = $1, 
    brand = $2,
    percentuale_ricarico = $3,
    riferimento = $4, 
    operatore = $5, 
    feedback = $6, 
    adulti = $7, 
    bambini = $8, 
    data_partenza = $9, 
    data = $10, 
    numero_preventivo = $11, 
    stato = $12,
    tipo_viaggio = $13,
    destinazione = $14,
    WHERE id = $15
  `,
      [
        parsedData.data.note,
        parsedData.data.brand,
        parsedData.data.percentuale_ricarico,
        parsedData.data.riferimento,
        parsedData.data.operatore,
        parsedData.data.feedback,
        parsedData.data.adulti,
        parsedData.data.bambini,
        parsedData.data.data_partenza,
        parsedData.data.data,
        parsedData.data.numero_preventivo,
        parsedData.data.stato,
        parsedData.data.tipo_viaggio,
        parsedData.data.destinazione,
        p.id,
      ]
    );
    return { values: result.rows[0], success: true, errorsMessage: "" };
  } catch (error) {
    console.error("Database Error: Failed to Update Preventivo: " + error);
    return {
      values: parsedData.data,
      success: false,
      errorsMessage: "Database Error: Failed to Update Preventivo: " + error,
    };
  }
};

export const updateServiziATerra = async (
  s: ServizioATerraInputGroup
): Promise<DBResult<ServizioATerraInputGroup>> => {
  let id_fornitore: string | null = null;
  let id_destinazione: string | null = null;
  if (s.fornitore) {
    const fornitore = await getFornitoreByName(s.fornitore);
    if (fornitore) {
      id_fornitore = fornitore.values?.id;
    }
  }
  if (s.destinazione) {
    const destinazione = await fetchDestinazioneByName(s.destinazione);
    if (destinazione) {
      id_destinazione = destinazione.values?.id;
    }
  }
  const parsedData = schemas.UpdateServizioATerraSchema.safeParse({
    id_fornitore: id_fornitore,
    id_destinazione: id_destinazione,
    descrizione: s.descrizione,
    data: s.data,
    numero_notti: s.numero_notti,
    numero_camere: s.numero_camere,
    totale: s.totale,
    valuta: s.valuta,
    cambio: s.cambio,
    servizio_aggiuntivo: s.servizio_aggiuntivo,
  });
  if (!parsedData.success) {
    console.error(
      "Failed to Update Servizio a Terra due to a validation error."
    );
    return {
      values: parsedData.data,
      success: false,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Servizio a Terra.",
    };
  }
  try {
    const result = await pool.query(
      `
    UPDATE servizi_a_terra SET 
    id_fornitore = $1,
    id_destinazione = $2,
    descrizione = $3, 
    data = $4, 
      numero_notti = $5, 
    numero_camere = $6,
    totale = $7, 
    valuta = $8, 
    cambio = $9, 
    servizio_aggiuntivo = $10
    WHERE id = $11
  `,
      [
        id_fornitore,
        id_destinazione,
        parsedData.data.descrizione,
        parsedData.data.data,
        parsedData.data.numero_notti,
        parsedData.data.numero_camere,
        parsedData.data.totale,
        parsedData.data.valuta,
        parsedData.data.cambio,
        parsedData.data.servizio_aggiuntivo,
        s.id,
      ]
    );
    return {
      values: result.rows[0],
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    return {
      values: parsedData.data,
      success: false,
      errorsMessage:
        "Database Error: Failed to Update Servizio a Terra: " + error,
    };
  }
};
export const updateVoli = async (
  v: VoloInputGroup
): Promise<DBResult<VoloInputGroup>> => {
  let id_fornitore: string | null = null;
  if (v.fornitore) {
    const fornitore = await getFornitoreByName(v.fornitore);
    if (fornitore) {
      id_fornitore = fornitore.values?.id;
    }
  }
  const parsedData = schemas.UpdateVoloSchema.safeParse({
    id_fornitore: id_fornitore,
    compagnia_aerea: v.compagnia_aerea,
    descrizione: v.descrizione,
    data_partenza: v.data_partenza,
    data_arrivo: v.data_arrivo,
    totale: v.totale,
    ricarico: v.ricarico,
    numero: v.numero,
    valuta: v.valuta,
    cambio: v.cambio,
  });
  if (!parsedData.success) {
    console.error("Failed to Update Volo due to a validation error.");
    return {
      values: parsedData.data,
      success: false,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Volo.",
    };
  }
  try {
    const result = await pool.query(
      `
    UPDATE voli SET 
    id_fornitore = $1,
    compagnia_aerea = $2, 
    descrizione = $3, 
    data_partenza = $4, 
    data_arrivo = $5, 
    totale = $6, 
    ricarico = $7,
    numero = $8,
    valuta = $9, 
    cambio = $10
    WHERE id = $11
  `,
      [
        id_fornitore,
        parsedData.data.compagnia_aerea,
        parsedData.data.descrizione,
        parsedData.data.data_partenza,
        parsedData.data.data_arrivo,
        parsedData.data.totale,
        parsedData.data.ricarico,
        parsedData.data.numero,
        parsedData.data.valuta,
        parsedData.data.cambio,
        v.id,
      ]
    );
    return {
      values: result.rows[0],
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error: Failed to Update Volo: " + error);
    return {
      success: false,
      errorsMessage: "Database Error: Failed to Update Volo: " + error,
    };
  }
};
export const updateAssicurazioni = async (
  a: AssicurazioneInputGroup
): Promise<DBResult<AssicurazioneInputGroup>> => {
  let id_fornitore: string | null = null;
  if (a.fornitore) {
    const fornitore = await getFornitoreByName(a.fornitore);
    if (fornitore) {
      id_fornitore = fornitore.values?.id;
    }
  }
  const parsedData = schemas.UpdateAssicurazioneSchema.safeParse({
    id_fornitore: id_fornitore,
    assicurazione: a.assicurazione,
    netto: a.netto,
    ricarico: a.ricarico,
    numero: a.numero,
  });
  if (!parsedData.success) {
    console.error("Failed to Update Assicurazione due to a validation error.");
    return {
      values: parsedData.data,
      success: false,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Assicurazione.",
    };
  }
  try {
    const result = await pool.query(
      `
    UPDATE assicurazioni SET 
    id_fornitore = $1,
    assicurazione = $2, 
    netto = $3,
    ricarico = $4,
    numero = $5
    WHERE id = $6
  `,
      [
        id_fornitore,
        parsedData.data.assicurazione,
        parsedData.data.netto,
        parsedData.data.ricarico,
        parsedData.data.numero,
        a.id,
      ]
    );
    return {
      values: result.rows[0],
      success: true,
      errorsMessage: "",
    };
  } catch (error) {
    console.error("Database Error: Failed to Update Assicurazione: " + error);
    return {
      success: false,
      errorsMessage: "Database Error: Failed to Update Assicurazione: " + error,
      errors: {},
    };
  }
};

export const updatePreventivoAlClienteDescrizione = async (
  p: PreventivoAlClienteInputGroup
): Promise<DBResult<PreventivoAlClienteInputGroup>> => {
  const parsedData = schemas.UpdatePreventivoAlClienteSchema.safeParse({
    id: p.id,
    descrizione_viaggio: sanitizeString(p.descrizione_viaggio),
  });

  if (!parsedData.success) {
    console.error(
      "Failed to Update Preventivo Al Cliente due to a validation error."
    );
    return {
      success: false,
      errorsMessage:
        "Failed to Update Preventivo Al Cliente due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }

  try {
    const result = await pool.query(
      `
    UPDATE preventivi_al_cliente SET 
    descrizione_viaggio = $1
    WHERE id = $2
  `,
      [parsedData.data.descrizione_viaggio, p.id]
    );
    return {
      success: true,
      values: result.rows[0],
      errorsMessage: "",
    };
  } catch (error) {
    console.error(
      "Database Error: Failed to Update Preventivo Al Cliente: " + error
    );
    return {
      success: false,
      errorsMessage:
        "Database Error: Failed to Update Preventivo Al Cliente: " + error,
    };
  }
};

export const updatePreventivoAlClienteRow = async (
  p: PreventivoAlClienteRow,
  senza_assicurazione: boolean,
  id_preventivo_al_cliente: string
): Promise<DBResult<PreventivoAlClienteRow>> => {
  const parsedData = schemas.UpdatePreventivoAlClienteRowSchema.safeParse({
    id: p.id,
    id_preventivo_al_cliente: id_preventivo_al_cliente,
    senza_assicurazione: senza_assicurazione,
    destinazione: p.destinazione,
    descrizione: p.descrizione,
    individuale: p.individuale,
    numero: p.numero,
  });
  if (!parsedData.success) {
    console.error(
      "Failed to Update Preventivo Al Cliente Row due to a validation error."
    );
    return {
      success: false,
      errorsMessage:
        "Failed to Update Preventivo Al Cliente Row due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await pool.query(
      `
    UPDATE preventivi_al_cliente_row SET 
    id_preventivo_al_cliente = $1,
    senza_assicurazione = $2,
    destinazione = $3,
    descrizione = $4,
    individuale = $5,
    numero = $6
    WHERE id = $7
  `,
      [
        parsedData.data.id_preventivo_al_cliente,
        parsedData.data.senza_assicurazione,
        parsedData.data.destinazione,
        parsedData.data.descrizione,
        parsedData.data.individuale,
        parsedData.data.numero,
        p.id,
      ]
    );
    return {
      success: true,
      values: result.rows[0],
      errorsMessage: "",
    };
  } catch (error) {
    console.error(
      "Database Error: Failed to Update Preventivo Al Cliente Row: " + error
    );
    return {
      success: false,
      errorsMessage:
        "Database Error: Failed to Update Preventivo Al Cliente Row: " + error,
    };
  }
};

export const searchClienti = async (
  c: ClienteInputGroup
): Promise<ClienteInputGroup[]> => {
  try {
    const allClienti = await Promise.all([
      fetchFilteredClienti(c.nome, 1),
      fetchFilteredClienti(c.cognome, 1), 
      fetchFilteredClienti(c.email, 1),
    ]);
    const clienti = Array.from(
      new Map(
        [...allClienti.values()]
          .flat()
          .map((r) => r.values)
          .flat()
          .map((r) => [r.id, r])
      ).values()
    );

    // Write to a temp file that can be read with fx
    const dir = "./json-test";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      `${dir}/allClienti.json`,
      JSON.stringify(clienti, null, 2)
    );

    return clienti.map(
      (c) =>
        new ClienteInputGroup(
          c.nome,
          c.cognome, 
          c.note,
          c.citta,
          c.collegato,
          c.tipo,
          c.data_di_nascita,
          c.tel,
          c.email,
          c.provenienza,
          c.indirizzo,
          c.cap,
          c.cf,
          c.luogo_nascita,
          c.provincia_nascita,
          c.numero_passaporto,
          c.data_scadenza_passaporto,
          c.nazionalita,
          c.provincia,
          c.sesso,
          c.id
        )
    );
  } catch (error) {
    console.error("Database Error in searchClienti:", error);
  }
};

/** AUTHENTICATION */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    //console.log(prevState);
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function _signOut() {
  await signOut();
}

export async function createUser(
  prevState: State<{email?: string[]; password?: string[] }>,
  formData: FormData
) {
  const parsedData = z
    .object({
      email: z
        .string({ invalid_type_error: "Please entre an email" })
        .email({ message: "Please enter an email" }),
      password: z
        .string({ invalid_type_error: "Please enter a password" })
        .min(6, {
          message: "The password should be at least 6 characters long",
        }),
    })
    .safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!parsedData.success) {
    console.error("Failed to Create User due to a validation error.");
    return {
      ...prevState,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  try {
    await pool.query(
      `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
`,
      [parsedData.data.email, hashedPassword]
    );
    return {
      ...prevState,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Database Error: Failed to Create User: " + error);
    return {
      ...prevState,
      message: "Database Error: Failed to Create User.",
      dbError: "Database Error: Failed to Create User.",
    };
  }
}

// #### DELETE BY ID ####
export const deleteServizioATerraById = async (id: string): Promise<void> => {
  try {
    await pool.query(`DELETE FROM servizi_a_terra WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete servizio a terra by id.");
  }
};

export const deleteVoloById = async (id: string): Promise<void> => {
  try {
    await pool.query(`DELETE FROM voli WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete volo by id.");
  }
};

export const deleteAssicurazioneById = async (id: string): Promise<void> => {
  try {
    await pool.query(`DELETE FROM assicurazioni WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete assicurazione by id.");
  }
};

export const deletePreventivoAlClienteRowById = async (
  id: string
): Promise<void> => {
  try {
    await pool.query(`DELETE FROM preventivi_al_cliente_row WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete preventivo al cliente row by id.");
  }
};

export const setOptionsJson = async () => {
  const fornitori = await fetchAllFornitori();
  const banche = await fetchAllBanche();
  const destinazioni = await fetchAllDestinazioni();
  const writeJsonToFile = (filename: string, data: any) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
  };

  if (fornitori.success) {
    writeJsonToFile(
      path.join(
        process.cwd(),
        "/app/lib/fundamental-entities-json/fornitori.json"
      ),
      fornitori.values
    );
  } else {
    console.error("Failed to fetch fornitori:", fornitori.errorsMessage);
  }

  if (banche.success) {
    writeJsonToFile(
      path.join(
        process.cwd(),
        "/app/lib/fundamental-entities-json/banche.json"
      ),
      banche.values
    );
  } else {
    console.error("Failed to fetch banche:", banche.errorsMessage);
  }

  if (destinazioni.success) {
    writeJsonToFile(
      path.join(
        process.cwd(),
        "/app/lib/fundamental-entities-json/destinazioni.json"
      ),
      destinazioni.values
    );
  } else {
    console.error("Failed to fetch destinazioni:", destinazioni.errorsMessage);
  }
};

export const getAllClienti = async (): Promise<Cliente[]> => {
  try {
    const clienti = await pool.query<Cliente>(`SELECT * FROM clienti`);
    console.log(clienti.rows);
    return clienti.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
};