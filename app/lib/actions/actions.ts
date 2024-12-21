"use server"; // IMPORTANTE: server actions devono essere precedute da 'use server' altrimenti bisogna dichiararlo per ciascuna!!

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { Cliente } from "../definitions";
import * as schemas from "./entity-zod-schemas";
import { fetchDestinazioneByName, fetchFilteredClienti, fetchFornitoreByName, fetchPreventiviByCliente, getDestinazioneByName, getFornitoreByName } from "../data";
import { AssicurazioneInputGroup, ClienteInputGroup, Data, ERRORMESSAGE, PreventivoInputGroup, ServizioATerraInputGroup, SUCCESSMESSAGE, VoloInputGroup } from "@/app/dashboard/(overview)/general-interface-create/general-interface.defs";
import { formatDate } from "../utils";

export type DBResult<A> = {
  message: string;
  values?: any;
  errors?: Partial<TransformToStringArray<A>>;
  errorsMessage?: string;
}

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

// ### DELETE GENERAL ENTITY ###
export const deleteEntityById = async (id: string, entityTableName: string) => {
  //console.log("action deleteEntity", { id, entityTableName });

  try {
    // Handle dependent deletions based on the entityTableName
    switch (entityTableName) {
      case "clienti":
        // Delete related pratiche
        await sql`DELETE FROM pratiche WHERE id_cliente = ${id}`;
        // Delete preventivi associated with the cliente
        const preventiviClienti =
          await sql`SELECT id FROM preventivi WHERE id_cliente = ${id}`;
        for (const prev of preventiviClienti.rows) {
          await deleteEntityById(prev.id, "preventivi");
        }
        break;

      case "fornitori":
        // Delete related pagamenti_assicurazioni
        await sql`DELETE FROM pagamenti_assicurazioni WHERE id_fornitore = ${id}`;
        // Delete related pagamenti_voli
        await sql`DELETE FROM pagamenti_voli WHERE id_fornitore = ${id}`;
        // Delete related pagamenti_servizi_a_terra
        await sql`DELETE FROM pagamenti_servizi_a_terra WHERE id_fornitore = ${id}`;
        // Delete related assicurazioni
        await sql`DELETE FROM assicurazioni WHERE id_fornitore = ${id}`;
        // Delete related voli
        await sql`DELETE FROM voli WHERE id_fornitore = ${id}`;
        // Delete related servizi_a_terra
        await sql`DELETE FROM servizi_a_terra WHERE id_fornitore = ${id}`;
        break;

      case "preventivi":
        // Delete related incassi_partecipanti
        await sql`
          DELETE FROM incassi_partecipanti
          WHERE id_partecipante IN (
            SELECT id FROM partecipanti WHERE id_preventivo = ${id}
          )
        `;
        // Delete related partecipanti
        await sql`DELETE FROM partecipanti WHERE id_preventivo = ${id}`;
        // Delete related preventivo_mostrare_cliente
        await sql`DELETE FROM preventivo_mostrare_cliente WHERE id_preventivo = ${id}`;
        // Delete related pagamenti_assicurazioni
        await sql`
          DELETE FROM pagamenti_assicurazioni
          WHERE id_assicurazione IN (
            SELECT id FROM assicurazioni WHERE id_preventivo = ${id}
          )
        `;
        // Delete related assicurazioni
        await sql`DELETE FROM assicurazioni WHERE id_preventivo = ${id}`;
        // Delete related pagamenti_voli
        await sql`
          DELETE FROM pagamenti_voli
          WHERE id_volo IN (
            SELECT id FROM voli WHERE id_preventivo = ${id}
          )
        `;
        // Delete related voli
        await sql`DELETE FROM voli WHERE id_preventivo = ${id}`;
        // Delete related pagamenti_servizi_a_terra
        await sql`
          DELETE FROM pagamenti_servizi_a_terra
          WHERE id_servizio_a_terra IN (
            SELECT id FROM servizi_a_terra WHERE id_preventivo = ${id}
          )
        `;
        // Delete related servizi_a_terra
        await sql`DELETE FROM servizi_a_terra WHERE id_preventivo = ${id}`;
        // Delete related pratiche
        await sql`DELETE FROM pratiche WHERE id_preventivo = ${id}`;
        break;

      case "destinazioni":
        // Delete related preventivo_mostrare_cliente
        await sql`DELETE FROM preventivo_mostrare_cliente WHERE id_destinazione = ${id}`;
        // Delete related servizi_a_terra
        await sql`DELETE FROM servizi_a_terra WHERE id_destinazione = ${id}`;
        break;

      case "banche":
        // Delete related incassi_partecipanti
        await sql`DELETE FROM incassi_partecipanti WHERE id_banca = ${id}`;
        // Delete related pagamenti_assicurazioni
        await sql`DELETE FROM pagamenti_assicurazioni WHERE id_banca = ${id}`;
        // Delete related pagamenti_voli
        await sql`DELETE FROM pagamenti_voli WHERE id_banca = ${id}`;
        // Delete related pagamenti_servizi_a_terra
        await sql`DELETE FROM pagamenti_servizi_a_terra WHERE id_banca = ${id}`;
        break;

      case "assicurazioni":
        // Delete related pagamenti_assicurazioni
        await sql`DELETE FROM pagamenti_assicurazioni WHERE id_assicurazione = ${id}`;
        break;

      case "voli":
        // Delete related pagamenti_voli
        await sql`DELETE FROM pagamenti_voli WHERE id_volo = ${id}`;
        break;

      case "servizi_a_terra":
        // Delete related pagamenti_servizi_a_terra
        await sql`DELETE FROM pagamenti_servizi_a_terra WHERE id_servizio_a_terra = ${id}`;
        break;

      case "partecipanti":
        // Delete related incassi_partecipanti
        await sql`DELETE FROM incassi_partecipanti WHERE id_partecipante = ${id}`;
        break;

      default:
        // For tables without dependencies, proceed to delete the entity
        break;
    }

    // Finally, delete the entity from the specified table
    const queryText = `DELETE FROM ${entityTableName} WHERE id = $1`;
    await sql.query(queryText, [id]);
  } catch (error) {
    console.error("Delete error:", error);
    return {
      message: `Database Error: Failed to delete from table ${entityTableName}.`,
    };
  }

  revalidatePath(`/dashboard/${entityTableName}`);
};

// CREATE ENTITY

export const createCliente = async (c: ClienteInputGroup): Promise<DBResult<ClienteInputGroup>> => {
  const parsedData = schemas.ClienteSchema.safeParse({
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
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: ERRORMESSAGE,
      errorsMessage: "Fields validation error.",
    };
  }
  try {
    const result = await sql`
    INSERT INTO clienti (nome, cognome, note, tipo, data_di_nascita, tel, email, citta, collegato, provenienza)
    VALUES (
    ${parsedData.data.nome}, 
    ${parsedData.data.cognome}, 
    ${parsedData.data.note}, 
    ${parsedData.data.tipo}, 
    ${parsedData.data.data_di_nascita}, 
    ${parsedData.data.tel}, 
    ${parsedData.data.email}, 
    ${parsedData.data.citta},
    ${parsedData.data.collegato},
    ${parsedData.data.provenienza})
    ON CONFLICT (nome, cognome) DO NOTHING;
  `;
    console.log("result of createCliente: ", result);
    return {
      values: parsedData.data,
      message: SUCCESSMESSAGE,
      errors: {},
      errorsMessage: "",
    };
  } catch (error) {
    console.log("db error: ", error);
    return {
      values: parsedData.data,
      errors: {},
      message: ERRORMESSAGE,
      errorsMessage: "Database Error.",
    };
  }
};
export const createPreventivo = async (
  p: PreventivoInputGroup,
  c: ClienteInputGroup,
  idCliente: string,
) => {
  const parsedData = schemas.PreventivoSchema.safeParse({
    id_cliente: idCliente,
    note: p.note,
    riferimento: p.riferimento,
    operatore: p.operatore,
    feedback: p.feedback,
    adulti: p.adulti,
    bambini: p.bambini,
    data_partenza: p.data_partenza,
    data: p.data,
    numero_preventivo: p.numero_preventivo,
    stato: p.stato,
  });
  if (!parsedData.success) {
    //console.log("parsedData.error", parsedData.error);
    return {
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Preventivo.",
    };
  }
  try {
    const result = await sql`
      INSERT INTO preventivi (
        id_cliente, 
        note, 
        riferimento, 
        operatore, 
        feedback, 
        adulti, 
        bambini, 
        data_partenza, 
        data, 
        numero_preventivo, 
        stato
      )
      VALUES (
        ${parsedData.data.id_cliente}, 
        ${parsedData.data.note}, 
        ${parsedData.data.riferimento}, 
        ${parsedData.data.operatore}, 
        ${parsedData.data.feedback}, 
        ${parsedData.data.adulti}, 
        ${parsedData.data.bambini}, 
        ${parsedData.data.data_partenza}, 
        ${parsedData.data.data}, 
        ${parsedData.data.numero_preventivo}, 
        ${parsedData.data.stato}
      )
      RETURNING *;
    `;
    //console.log('result of createPreventivo: ', result);
    return {...result, message: SUCCESSMESSAGE, errorsMessage: ''};
  } catch (error) {
    //console.log("db error: ", error);
    return {
      message: ERRORMESSAGE,
      values: parsedData.data,
      errorsMessage: error,
    };
  }
};
export const createServizioATerra = async (s: ServizioATerraInputGroup, id_preventivo: string, servizio_aggiuntivo: boolean) => {

  const fornitore = await fetchFornitoreByName(s.fornitore);
  const destinazione = await fetchDestinazioneByName(s.destinazione);
  //console.log('fornitore: ', fornitore);
  //console.log('destinazione: ', destinazione);
  if (!fornitore || !destinazione) {
    return {
      message: "Fornitore or Destinazione not found.",
    };
  }
  const parsedData = schemas.ServizioATerraSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: fornitore.id,
    id_destinazione: destinazione.id,
    descrizione: s.descrizione,
    data: s.data,
    numero_notti: s.numero_notti,
    totale: s.totale,
    valuta: s.valuta,
    cambio: s.cambio,
    servizio_aggiuntivo: servizio_aggiuntivo,
  });

  if (!parsedData.success) {
    return {
      message: "Failed to Create Servizio A Terra.",
    };
  }
  try {
    const result = await sql`
    INSERT INTO servizi_a_terra (id_preventivo, id_fornitore, id_destinazione, descrizione, data, numero_notti, totale, valuta, cambio, servizio_aggiuntivo)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.id_destinazione}, ${parsedData.data.descrizione}, ${parsedData.data.data}, ${parsedData.data.numero_notti}, ${parsedData.data.totale}, ${parsedData.data.valuta}, ${parsedData.data.cambio}, ${parsedData.data.servizio_aggiuntivo})
    RETURNING *;
    `;
    //console.log('result of createServizioATerra: ', result);
    return result;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Servizio A Terra.",
    };
  }
}
export const createVolo = async (v: VoloInputGroup, id_preventivo: string) => {
  const fornitore = await fetchFornitoreByName(v.fornitore);
  console.log('createVolo, volo ricevuto: ', v);
  
  console.log('fornitore: ', fornitore);
  if (!fornitore) {
    return {
      message: "Fornitore not found.",
    };
  }
  const parsedData = schemas.VoloSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: fornitore.id,
    compagnia_aerea: v.compagnia,
    descrizione: v.descrizione,
    data_partenza: v.data_partenza,
    data_arrivo: v.data_arrivo,
    totale: v.totale,
    valuta: v.valuta,
    cambio: v.cambio
  });

  if (!parsedData.success) {
    console.log('parsedData.error: ', parsedData.error);
    return {
      message: ERRORMESSAGE,
      errorsMessage: "Failed to Create Volo due to a parsing Zod error.",
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  try {
    const result = await sql`
    INSERT INTO voli (id_preventivo, id_fornitore, compagnia_aerea, descrizione, data_partenza, data_arrivo, totale, valuta, cambio)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.compagnia_aerea}, ${parsedData.data.descrizione}, ${parsedData.data.data_partenza}, ${parsedData.data.data_arrivo}, ${parsedData.data.totale}, ${parsedData.data.valuta}, ${parsedData.data.cambio})
    RETURNING *;
    `;
    console.log('result of createVolo: ', result);
    return result;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Volo.",
    };
  }
}
export const createAssicurazione = async (a: AssicurazioneInputGroup, id_preventivo: string) => {
  const fornitore = await fetchFornitoreByName(a.fornitore);
  //console.log('fornitore: ', fornitore);
  if (!fornitore) {
    return {
      message: "Fornitore not found.",
    };
  }
  const parsedData = schemas.AssicurazioneSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: fornitore.id,
    assicurazione: a.assicurazione,
    netto: a.netto,
  });
  if (!parsedData.success) {
    return {
      message: ERRORMESSAGE,
      errorsMessage: "Failed to Create Assicurazione due to a parsing Zod error.",
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  try {
    const result = await sql`
    INSERT INTO assicurazioni (id_preventivo, id_fornitore, assicurazione, netto)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.assicurazione}, ${parsedData.data.netto})
    RETURNING *;
    `;
    //console.log('result of createAssicurazione: ', result);
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: "Database Error: Failed to Create Assicurazione.",
      errorsMessage: error
    };
  }
}

// ### GET ENTITY BY PREVENTIVO ###
export const getPreventivoById = async (id_preventivo: string) => {
  try {
    const result = await sql`SELECT * FROM preventivi WHERE id = ${id_preventivo}`;
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error
    };
  }
}

export const getServiziATerraByPreventivoId = async (id_preventivo: string) => {
  try {
    const result = await sql`SELECT * FROM servizi_a_terra WHERE id_preventivo = ${id_preventivo}`;
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error
    };
  }
}
export const getServiziAggiuntiviByPreventivoId = async (id_preventivo: string) => {
  try {
    const result = await sql`SELECT * FROM servizi_a_terra WHERE id_preventivo = ${id_preventivo} AND servizio_aggiuntivo = true`;
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error
    };
  }
}
export const getVoliByPreventivoId = async (id_preventivo: string) => {
  try {
    const result = await sql`SELECT * FROM voli WHERE id_preventivo = ${id_preventivo}`;
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error
    };
  }
}
export const getAssicurazioniByPreventivoId = async (id_preventivo: string) => {
  
  try {
    const result = await sql`SELECT * FROM assicurazioni WHERE id_preventivo = ${id_preventivo}`;
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error
    };
  }
}


// ## GET DESTINAZIONE BY ID
export const getDestinazioneById = async (id_destinazione: string) => {
  try {
    const result = await sql`SELECT * FROM destinazioni WHERE id = ${id_destinazione}`;
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error
    };
  }
}
export const getFornitoreById = async (id_fornitore: string) => {
  try {
    const result = await sql`SELECT * FROM fornitori WHERE id = ${id_fornitore}`;
    return {
      ...result, 
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      rowCount: 0,
      rows: [],
      message: ERRORMESSAGE,
      errorsMessage: error
    };
  }
}

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
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: ERRORMESSAGE,
      errorsMessage: "Missing Fields. Failed to Create Cliente.",
    };
  }
  try {
    await sql`
    UPDATE clienti SET 
    nome = ${parsedData.data.nome}, 
    cognome = ${parsedData.data.cognome}, 
    note = ${parsedData.data.note}, 
    tipo = ${parsedData.data.tipo}, 
    data_di_nascita = ${parsedData.data.data_di_nascita}, 
    tel = ${parsedData.data.tel}, 
    email = ${parsedData.data.email}, 
    citta = ${parsedData.data.citta}, 
    collegato = ${parsedData.data.collegato}, 
    provenienza = ${parsedData.data.provenienza}
    WHERE id = ${id}
    `;
    console.log("SUCCESS UPDATING CLIENTE");
    return {
      values: parsedData.data,
      message: SUCCESSMESSAGE,
      errors: {},
      errorsMessage: "",
    };
  } catch (error) {
    console.log("db error: ", error);
    return {
      values: parsedData.data,
      message: ERRORMESSAGE,
      errors: {},
      errorsMessage: "Database Error: Failed to Update Cliente: " + error,
    };
  }
};
export const updatePreventivo = async (p: PreventivoInputGroup, idCliente: string): Promise<DBResult<PreventivoInputGroup>> => {
  const parsedData = schemas.UpdatePreventivoSchema.safeParse({
    id: p.id,
    note: p.note,
    riferimento: p.riferimento,
    operatore: p.operatore,
    feedback: p.feedback,
    adulti: p.adulti?.toString(),
    bambini: p.bambini?.toString(),
    data_partenza: formatDate(p.data_partenza),
    data: formatDate(p.data),
    numero_preventivo: p.numero_preventivo,
    stato: p.stato,
  });
  if (!parsedData.success) {
    //console.log("parsedData.error", parsedData.error);
    return {
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: ERRORMESSAGE,
      errorsMessage: "Missing Fields. Failed to Update Preventivo.",
    };
  }
  try {
    const result = await sql`
    UPDATE preventivi SET 
    note = ${parsedData.data.note}, 
    riferimento = ${parsedData.data.riferimento}, 
    operatore = ${parsedData.data.operatore}, 
    feedback = ${parsedData.data.feedback}, 
    adulti = ${parsedData.data.adulti?.toString()}, 
    bambini = ${parsedData.data.bambini?.toString()}, 
    data_partenza = ${parsedData.data.data_partenza}, 
    data = ${parsedData.data.data}, 
    numero_preventivo = ${parsedData.data.numero_preventivo}, 
    stato = ${parsedData.data.stato}
    WHERE id = ${p.id}
  `;
    //console.log("SUCCESS UPDATING PREVENTIVO");
    return {
      ...result,
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    //console.log("db error: ", error);
    return {
      values: parsedData.data,
      message: ERRORMESSAGE,
      errorsMessage: "Database Error: Failed to Update Preventivo: " + error,
    };
  }
};

export const updateServiziATerra = async (s: ServizioATerraInputGroup, idPreventivo: string): Promise<DBResult<ServizioATerraInputGroup>> => {
  
  const parsedData = schemas.UpdateServizioATerraSchema.safeParse({
    id_preventivo: idPreventivo,
    descrizione: s.descrizione,
    data: s.data,
    numero_notti: s.numero_notti?.toString(),
    totale: s.totale?.toString(),
    valuta: s.valuta?.toString(),
    cambio: s.cambio?.toString(),
    servizio_aggiuntivo: s.servizio_aggiuntivo,
  });
  if (!parsedData.success) {
    return {
      values: parsedData.data,
      message: ERRORMESSAGE,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Servizio a Terra.",
    };
  }
  try {
    const result = await sql`
    UPDATE servizi_a_terra SET 
    descrizione = ${parsedData.data.descrizione}, 
    data = ${parsedData.data.data}, 
    numero_notti = ${parsedData.data.numero_notti?.toString()}, 
    totale = ${parsedData.data.totale?.toString()}, 
    valuta = ${parsedData.data.valuta?.toString()}, 
    cambio = ${parsedData.data.cambio?.toString()}, 
    servizio_aggiuntivo = ${parsedData.data.servizio_aggiuntivo}
    WHERE id = ${s.id}
  `;
    return {
      ...result,
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      message: ERRORMESSAGE,
      errorsMessage: "Database Error: Failed to Update Servizio a Terra: " + error,
    };
  }
} 
export const updateVoli = async (v: VoloInputGroup, idPreventivo: string): Promise<DBResult<VoloInputGroup>> => {
  const parsedData = schemas.UpdateVoloSchema.safeParse({
    compagnia_aerea: v.compagnia,
    descrizione: v.descrizione,
    data_partenza: v.data_partenza,
    data_arrivo: v.data_arrivo,
    totale: v.totale?.toString(),
    valuta: v.valuta?.toString(),
    cambio: v.cambio?.toString()
  });
  if (!parsedData.success) {
    return {
      values: parsedData.data,
      message: ERRORMESSAGE,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Volo.",
    };
  }
  try {
    const result = await sql`
    UPDATE voli SET 
    compagnia_aerea = ${parsedData.data.compagnia_aerea}, 
    descrizione = ${parsedData.data.descrizione}, 
    data_partenza = ${parsedData.data.data_partenza}, 
    data_arrivo = ${parsedData.data.data_arrivo}, 
    totale = ${parsedData.data.totale?.toString()}, 
    valuta = ${parsedData.data.valuta?.toString()}, 
    cambio = ${parsedData.data.cambio?.toString()}
    WHERE id = ${v.id}
  `;
    return {
      ...result,
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      message: ERRORMESSAGE,
      errorsMessage: "Database Error: Failed to Update Volo: " + error,
    };
  }
}
export const updateAssicurazioni = async (a: AssicurazioneInputGroup, idPreventivo: string): Promise<DBResult<AssicurazioneInputGroup>> => {
  const parsedData = schemas.AssicurazioneSchema.safeParse({
    id_preventivo: idPreventivo,
    id_fornitore: a.fornitore,
    assicurazione: a.assicurazione,
    netto: a.netto?.toString(),
  });
  if (!parsedData.success) {
    return {
      values: parsedData.data,
      message: ERRORMESSAGE,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Assicurazione.",
    };
  }
  try {
    const result = await sql`
    UPDATE assicurazioni SET 
    assicurazione = ${parsedData.data.assicurazione}, 
    netto = ${parsedData.data.netto?.toString()}
    WHERE id = ${a.id}
  `;
    return {
      ...result,
      message: SUCCESSMESSAGE,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      message: ERRORMESSAGE,
      errorsMessage: "Database Error: Failed to Update Assicurazione: "+ error,
      errors: {},
    };
  }
}
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
export async function submitCreatePreventivoGI(data: Data) {
  try {
      let res = {
        preventivo: null,
        servizi: [],
        voli: [],
        assicurazioni: []
      };
      const preventivoCreato= await createPreventivo(
        data.preventivo,
        data.cliente,
        data.cliente.id
      );
      console.log('PREVENTIVO CREATO: ', preventivoCreato);
      let idPreventivo: string | undefined;
      if (preventivoCreato && 'rows' in preventivoCreato) {
        idPreventivo = preventivoCreato.rows[0].id;
        res.preventivo = preventivoCreato.rows[0];
      }

      for (const s of data.serviziATerra) {
        const servizioCreato = await createServizioATerra(s, idPreventivo, false);
        res.servizi.push(servizioCreato);
      }
      for(const s of data.serviziAggiuntivi) {
        const servizioCreato = await createServizioATerra(s, idPreventivo, true);
        if (servizioCreato && 'rows' in servizioCreato) {
          res.servizi.push(servizioCreato.rows[0]);
        }
      }
      for(const v of data.voli) {
        const voloCreato = await createVolo(v, idPreventivo);
        if (voloCreato && 'rows' in voloCreato) {
          res.voli.push(voloCreato.rows[0]);
        }
      }
      for(const a of data.assicurazioni) {
        const assicurazioneCreato = await createAssicurazione(a, idPreventivo);
        if (assicurazioneCreato && 'rows' in assicurazioneCreato) {
          res.assicurazioni.push(assicurazioneCreato.rows[0]);
        }
      }
    } catch (error) {
    //console.log("error: ", error);
  }
}

export const searchClienti = async (
  c: ClienteInputGroup
): Promise<ClienteInputGroup[]> => {
  const clientiByNome = await fetchFilteredClienti(c.nome, 1);
  const clientiByCognome = await fetchFilteredClienti(c.cognome, 1);
  const clientiByEmail = await fetchFilteredClienti(c.email, 1);
  const clientiByTel = await fetchFilteredClienti(c.tel, 1);
  const clientiByCitta = await fetchFilteredClienti(c.citta, 1);
  const clientiByCollegato = await fetchFilteredClienti(c.collegato, 1);
  const clientiByProvenienza = await fetchFilteredClienti(c.provenienza, 1);
  const clientiByTipo = await fetchFilteredClienti(c.tipo, 1);
  const allClienti = [
    ...clientiByNome,
    ...clientiByCognome,
    ...clientiByEmail,
    ...clientiByTel,
    ...clientiByCitta,
    ...clientiByCollegato,
    ...clientiByProvenienza,
    ...clientiByTipo,
  ];

/*//console.log(
    "clientiByNome: ",
    clientiByNome,
    "clientiByCognome: ",
    clientiByCognome,
    "clientiByEmail: ",
    clientiByEmail,
    "clientiByTel: ",
    clientiByTel,
    "clientiByCitta: ",
    clientiByCitta,
    "clientiByCollegato: ",
    clientiByCollegato,
    "clientiByProvenienza: ",
    clientiByProvenienza,
    "clientiByTipo: ",
    clientiByTipo
  );
*/
  // Get sets of IDs from each list
  const allIds = new Set(allClienti.map((cliente) => cliente.id));
  const idsByNome = c.nome
    ? new Set(clientiByNome.map((cliente) => cliente.id))
    : allIds;
  const idsByCognome = c.cognome
    ? new Set(clientiByCognome.map((cliente) => cliente.id))
    : allIds;
  const idsByEmail = c.email
    ? new Set(clientiByEmail.map((cliente) => cliente.id))
    : allIds;
  const idsByTel = c.tel
    ? new Set(clientiByTel.map((cliente) => cliente.id))
    : allIds;
  const idsByCitta = c.citta
    ? new Set(clientiByCitta.map((cliente) => cliente.id))
    : allIds;
  const idsByCollegato = c.collegato
    ? new Set(clientiByCollegato.map((cliente) => cliente.id))
    : allIds;
  const idsByProvenienza = c.provenienza
    ? new Set(clientiByProvenienza.map((cliente) => cliente.id))
    : allIds;
  const idsByTipo = c.tipo
    ? new Set(clientiByTipo.map((cliente) => cliente.id))
    : allIds;

  // Compute the intersection of the IDs
  const intersectedIds = [...idsByNome].filter(
    (id) =>
      idsByNome.has(id) &&
      idsByCognome.has(id) &&
      idsByEmail.has(id) &&
      idsByTel.has(id) &&
      idsByCitta.has(id) &&
      idsByCollegato.has(id) &&
      idsByProvenienza.has(id) &&
      idsByTipo.has(id)
  );

  ////console.log("intersectedIds: ", intersectedIds);

  // Retrieve the clients corresponding to the intersected IDs
  const clientiMap = new Map<string, Cliente>();
  for (const cliente of allClienti) {
    if (intersectedIds.includes(cliente.id)) {
      clientiMap.set(cliente.id, cliente);
    }
  }

  const intersectedClienti = Array.from(clientiMap.values()).map( c => new ClienteInputGroup(c.nome, c.cognome, c.note, c.citta, c.collegato, c.tipo, c.data_di_nascita, c.tel, c.email, c.provenienza, c.id));
  //console.log("intersectedClienti: ", intersectedClienti);
  return intersectedClienti;
};

export const searchPreventivi = async (clienteId: string): Promise<PreventivoInputGroup[]> => {
  const preventiviByCliente = await fetchPreventiviByCliente(clienteId);
  console.log("PREVENTIVIBYCLIENTE: ", preventiviByCliente);
  const preventivi = preventiviByCliente.map(p => new PreventivoInputGroup(p.numero_preventivo, p.brand, p.riferimento, p.operatore, p.feedback, p.note, p.adulti, p.bambini, p.data_partenza, p.data, p.stato, p.id));
  return preventivi;
} 

/** AUTHENTICATION */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    console.log(prevState);
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

export async function createUser(
  prevState: State<{ name?: string[]; email?: string[]; password?: string[] }>,
  formData: FormData
) {
  const parsedData = z
    .object({
      name: z.string({ invalid_type_error: "Please enter a username" }).min(4, {
        message: "The username should be at least 4 characters long",
      }),
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
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!parsedData.success) {
    return {
      ...prevState,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  try {
    await sql`
    INSERT INTO users (name, email, password)
    VALUES (${parsedData.data.name}, ${parsedData.data.email}, ${hashedPassword})
  `;
    return {
      ...prevState,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      ...prevState,
      message: "Database Error: Failed to Create User.",
      dbError: "Database Error: Failed to Create User.",
    };
  }
}
