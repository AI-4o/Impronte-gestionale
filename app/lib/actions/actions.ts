"use server"; // IMPORTANTE: server actions devono essere precedute da 'use server' altrimenti bisogna dichiararlo per ciascuna!!

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { Cliente } from "../definitions";
import * as schemas from "./entity-zod-schemas";
import { fetchFilteredClienti, fetchFornitoreByName, fetchDestinazioneByName, getFornitoreByName } from "../data";
import { AssicurazioneInputGroup, ClienteInputGroup, Data, ERRORMESSAGE, PreventivoInputGroup, ServizioATerraInputGroup, VoloInputGroup } from "@/app/dashboard/(overview)/general-interface/general-interface.defs";
import { formatDate } from "../utils";
import moment from "moment";
export type DBResult<A> = {
  success: boolean;
  values?: any; // TODO: successivo refactoring si rende di tipo A | A[] | null
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

// CREATE 

export const createCliente = async (c: ClienteInputGroup): Promise<DBResult<ClienteInputGroup>> => {
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
  });
  if (!parsedData.success) {
    return {
      success: false,
      errorsMessage: "Failed to create cliente due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await sql`
    INSERT INTO clienti (nome, cognome, note, tipo, data_di_nascita, indirizzo, CAP, citta, CF, collegato, provenienza, tel, email)
    VALUES (
    ${parsedData.data.nome}, 
    ${parsedData.data.cognome}, 
    ${parsedData.data.note}, 
    ${parsedData.data.tipo}, 
    ${parsedData.data.data_di_nascita}, 
    ${parsedData.data.indirizzo}, 
    ${parsedData.data.cap}, 
    ${parsedData.data.citta},
    ${parsedData.data.cf},
    ${parsedData.data.collegato},
    ${parsedData.data.provenienza},
    ${parsedData.data.tel},
    ${parsedData.data.email}
    )
  `;
    return {values: result.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
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
  idCliente: string,
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
  });
  if (!parsedData.success) {
    return {
      success: false,
      errorsMessage: "Failed to Create Preventivo due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await sql`
      INSERT INTO preventivi (
        id_cliente, 
        note, 
        percentuale_ricarico,
        riferimento, 
        operatore, 
        brand,
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
        ${parsedData.data.percentuale_ricarico},
        ${parsedData.data.riferimento}, 
        ${parsedData.data.operatore}, 
        ${parsedData.data.brand},
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
    return {values: result.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    return {
      success: false,
      errorsMessage: "Database Error in createPreventivo: " + error,
      values: parsedData.data,
    };
  }
};
export const createServizioATerra = 
async (s: ServizioATerraInputGroup, id_preventivo: string, servizio_aggiuntivo: boolean): Promise<DBResult<ServizioATerraInputGroup>> => {
  let id_fornitore: string | null = null;
  let id_destinazione: string | null = null;
  if(s.fornitore) {
    const dbResultFornitore = await fetchFornitoreByName(s.fornitore);
    if(dbResultFornitore.success) {
      id_fornitore = dbResultFornitore.values.id;
    }
  }
  if(s.destinazione) {
    const dbResultDestinazione = await fetchDestinazioneByName(s.destinazione);
    if(dbResultDestinazione.success) {
      id_destinazione = dbResultDestinazione.values.id;
    }
  }

  const parsedData = schemas.ServizioATerraSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: id_fornitore,
    id_destinazione: id_destinazione,
    descrizione: s.descrizione,
    data: s.data,
    numero_notti: s.numero_notti,
    numero_camere: s.numero_camere,
    totale: s.totale,
    valuta: s.valuta,
    cambio: s.cambio,
    servizio_aggiuntivo: servizio_aggiuntivo,
  });

  if (!parsedData.success) {
    return {
      success: false,
      errorsMessage: "Failed to Create servizioATerra due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await sql`
    INSERT INTO servizi_a_terra (id_preventivo, id_fornitore, id_destinazione, descrizione, data, numero_notti, numero_camere, totale, valuta, cambio, servizio_aggiuntivo)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.id_destinazione}, ${parsedData.data.descrizione}, ${parsedData.data.data}, ${parsedData.data.numero_notti}, ${parsedData.data.numero_camere}, ${parsedData.data.totale}, ${parsedData.data.valuta}, ${parsedData.data.cambio}, ${parsedData.data.servizio_aggiuntivo})
    RETURNING *;
    `;
    return {values: result.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    return {
      success: false,
      errorsMessage: "Database Error in createServizioATerra: " + error,
      values: parsedData.data,
    };
  }
}
export const createVolo = 
async (v: VoloInputGroup, id_preventivo: string): Promise<DBResult<VoloInputGroup>> => {
  const fornitore = await fetchFornitoreByName(v.fornitore);

  const parsedData = schemas.VoloSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: fornitore.values?.id,
    compagnia_aerea: v.compagnia,
    descrizione: v.descrizione,
    data_partenza: v.data_partenza,
    data_arrivo: v.data_arrivo,
    totale: v.totale,
    ricarico: v.ricarico,
    numero: v.numero,
    valuta: v.valuta,
    cambio: v.cambio
  });

  if (!parsedData.success) {
    return {
      success: false,
      errorsMessage: "Failed to Create Volo due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await sql`
    INSERT INTO voli (id_preventivo, id_fornitore, compagnia_aerea, descrizione, data_partenza, data_arrivo, totale, ricarico, numero, valuta, cambio)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.compagnia_aerea}, ${parsedData.data.descrizione}, ${parsedData.data.data_partenza}, ${parsedData.data.data_arrivo}, ${parsedData.data.totale}, ${parsedData.data.ricarico}, ${parsedData.data.numero}, ${parsedData.data.valuta}, ${parsedData.data.cambio})
    RETURNING *;
    `;
    //console.log('result of createVolo: ', result);
    return {values: result.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    return {
      success: false,
      errorsMessage: "Database Error in Create Volo: " + error,
      values: parsedData.data,
    };
  }
}
export const createAssicurazione = 
async (a: AssicurazioneInputGroup, id_preventivo: string): Promise<DBResult<AssicurazioneInputGroup>> => {
  const fornitore = await fetchFornitoreByName(a.fornitore);
  const parsedData = schemas.AssicurazioneSchema.safeParse({
    id_preventivo: id_preventivo,
    id_fornitore: fornitore.values?.id,
    assicurazione: a.assicurazione,
    netto: a.netto,
    ricarico: a.ricarico,
  });
  if (!parsedData.success) {
    return {
      success: false,
      errorsMessage: "Failed to Create Assicurazione due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await sql`
    INSERT INTO assicurazioni (id_preventivo, id_fornitore, assicurazione, netto, ricarico)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.assicurazione}, ${parsedData.data.netto}, ${parsedData.data.ricarico})
    RETURNING *;
    `;
    return {values: result.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    return {
      success: false,
      errorsMessage: "Database Error in createAssicurazione: " + error,
      values: parsedData.data,
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
export async function submitCreatePreventivoGI(data: Data): Promise<DBResult<PreventivoInputGroup>> {
  try {
      let res = {
        preventivo: null,
        servizi: [],
        voli: [],
        assicurazioni: [],
        message: '',
        errorsMessage: ''
      };
      const resCreatePreventivo: DBResult<PreventivoInputGroup> = await createPreventivo(
        data.preventivo,
        data.cliente,
        data.cliente.id
      );
      let idPreventivo: string | undefined;

      // if error in createPreventivo, return error
      if(!resCreatePreventivo.success) {
        return resCreatePreventivo;
      }

      if (resCreatePreventivo.success) {
        idPreventivo = resCreatePreventivo.values.id;
        res.preventivo = resCreatePreventivo.values;
      }

      // create serviziATerra
      for (const s of data.serviziATerra) {
        const resCreateServizio = await createServizioATerra(s, idPreventivo, false);
        if(!resCreateServizio.success) {
          return resCreateServizio;
        }
        res.servizi.push(resCreateServizio);
      }
      for(const s of data.serviziAggiuntivi) {
        const resCreateServizio = await createServizioATerra(s, idPreventivo, true);
        if(!resCreateServizio.success) {
          return resCreateServizio;
        }
        res.servizi.push(resCreateServizio);
      }
      for(const v of data.voli) {
        const resCreateVolo = await createVolo(v, idPreventivo);
        if (!resCreateVolo.success) {
          return resCreateVolo;
        }
        res.voli.push(resCreateVolo);
      }
      for(const a of data.assicurazioni) {
        const resCreateAssicurazione = await createAssicurazione(a, idPreventivo);
        if (!resCreateAssicurazione.success) {
          return resCreateAssicurazione;
        }
        res.assicurazioni.push(resCreateAssicurazione);
      }
      return {values: res, success: true, errorsMessage: ''};
    } catch (error) {
      return {
        success: false,
        errorsMessage: "Database Error in submitCreatePreventivoGI: " + error
      };
    }
}


// ## GET DESTINAZIONE BY ID
export const getDestinazioneById = async (id_destinazione: string) => {
  try {
    const result = await sql`SELECT * FROM destinazioni WHERE id = ${id_destinazione}`;
    return {values: result.rows[0], success: true, errorsMessage: ''};
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
    return {values: result.rows[0], success: true, errorsMessage: ''};
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
    indirizzo: c.indirizzo,
    cap: c.cap,
    cf: c.cf,
  });
  if (!parsedData.success) {
    return {
      success: false,
      errorsMessage: "Failed to Update Cliente due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
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
    provenienza = ${parsedData.data.provenienza},
    indirizzo = ${parsedData.data.indirizzo},
    CAP = ${parsedData.data.cap},
    CF = ${parsedData.data.cf}
    WHERE id = ${id}
    `;
    return {
      success: true,
      values: parsedData.data,
      errors: {},
      errorsMessage: "",
    };
  } catch (error) {
    return {
      success: false,
      errorsMessage: "Database Error: Failed to Update Cliente: " + error,
      values: parsedData.data,
      errors: {},
    };
  }
};
export const updatePreventivo = async (p: PreventivoInputGroup, idCliente: string): Promise<DBResult<PreventivoInputGroup>> => {
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
  });
  if (!parsedData.success) {
    return {
      success: false,
      errorsMessage: "Failed to Update Preventivo due to a validation error.",
      errors: parsedData.error.flatten().fieldErrors,
      values: parsedData.data,
    };
  }
  try {
    const result = await sql`
    UPDATE preventivi SET 
    note = ${parsedData.data.note}, 
    brand = ${parsedData.data.brand},
    percentuale_ricarico = ${parsedData.data.percentuale_ricarico},
    riferimento = ${parsedData.data.riferimento}, 
    operatore = ${parsedData.data.operatore}, 
    feedback = ${parsedData.data.feedback}, 
    adulti = ${parsedData.data.adulti}, 
    bambini = ${parsedData.data.bambini}, 
    data_partenza = ${parsedData.data.data_partenza}, 
    data = ${parsedData.data.data}, 
    numero_preventivo = ${parsedData.data.numero_preventivo}, 
    stato = ${parsedData.data.stato}
    WHERE id = ${p.id}
  `;
    return {values: result.rows[0], success: true, errorsMessage: ''};
  } catch (error) {
    return {
      values: parsedData.data,
      success: false,
      errorsMessage: "Database Error: Failed to Update Preventivo: " + error,
    };
  }
};

export const updateServiziATerra = async (s: ServizioATerraInputGroup): Promise<DBResult<ServizioATerraInputGroup>> => {
  let id_fornitore: string | null = null;
  let id_destinazione: string | null = null;
  if(s.fornitore) {
    const fornitore = await getFornitoreByName(s.fornitore);
    if(fornitore) {
      id_fornitore = fornitore.values?.id;
    }
  }
  if(s.destinazione) {
    const destinazione = await fetchDestinazioneByName(s.destinazione);
    if(destinazione) {
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
    return {
      values: parsedData.data,
      success: false,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Servizio a Terra.",
    };
  }
  try {
    const result = await sql`
    UPDATE servizi_a_terra SET 
    id_fornitore = ${id_fornitore},
    id_destinazione = ${id_destinazione},
    descrizione = ${parsedData.data.descrizione}, 
    data = ${parsedData.data.data}, 
      numero_notti = ${parsedData.data.numero_notti}, 
    numero_camere = ${parsedData.data.numero_camere},
    totale = ${parsedData.data.totale}, 
    valuta = ${parsedData.data.valuta}, 
    cambio = ${parsedData.data.cambio}, 
    servizio_aggiuntivo = ${parsedData.data.servizio_aggiuntivo}
    WHERE id = ${s.id}
  `;
    return {
      values: result.rows[0],
      success: true,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      values: parsedData.data,
      success: false,
      errorsMessage: "Database Error: Failed to Update Servizio a Terra: " + error,
    };
  }
} 
export const updateVoli = async (v: VoloInputGroup): Promise<DBResult<VoloInputGroup>> => {
  let id_fornitore: string | null = null;
  if(v.fornitore) {
    const fornitore = await getFornitoreByName(v.fornitore);
    if(fornitore) {
      id_fornitore = fornitore.values?.id;
    }
  }
  const parsedData = schemas.UpdateVoloSchema.safeParse({
    id_fornitore: id_fornitore,
    compagnia_aerea: v.compagnia,
    descrizione: v.descrizione,
    data_partenza: v.data_partenza,
    data_arrivo: v.data_arrivo,
    totale: v.totale,
    ricarico: v.ricarico,
    numero: v.numero,
    valuta: v.valuta,
    cambio: v.cambio
  });
  if (!parsedData.success) {
    return {
      values: parsedData.data,
      success: false,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Volo.",
    };
  }
  try {
    const result = await sql`
    UPDATE voli SET 
    id_fornitore = ${id_fornitore},
    compagnia_aerea = ${parsedData.data.compagnia_aerea}, 
    descrizione = ${parsedData.data.descrizione}, 
    data_partenza = ${parsedData.data.data_partenza}, 
    data_arrivo = ${parsedData.data.data_arrivo}, 
    totale = ${parsedData.data.totale}, 
    ricarico = ${parsedData.data.ricarico},
    numero = ${parsedData.data.numero},
    valuta = ${parsedData.data.valuta}, 
    cambio = ${parsedData.data.cambio}
    WHERE id = ${v.id}
  `;
    return {
      values: result.rows[0],
      success: true,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      success: false,
      errorsMessage: "Database Error: Failed to Update Volo: " + error,
    };
  }
}
export const updateAssicurazioni = async (a: AssicurazioneInputGroup): Promise<DBResult<AssicurazioneInputGroup>> => {
  let id_fornitore: string | null = null;
  if(a.fornitore) {
    const fornitore = await getFornitoreByName(a.fornitore);
    if(fornitore) {
      id_fornitore = fornitore.values?.id;
    }
  }
  const parsedData = schemas.UpdateAssicurazioneSchema.safeParse({
    id_fornitore: id_fornitore,
    assicurazione: a.assicurazione,
    netto: a.netto,
    ricarico: a.ricarico,
  });
  if (!parsedData.success) {
    return {
      values: parsedData.data,
      success: false,
      errors: parsedData.error.flatten().fieldErrors,
      errorsMessage: "Missing Fields. Failed to Update Assicurazione.",
    };
  }
  try {
    const result = await sql`
    UPDATE assicurazioni SET 
    id_fornitore = ${id_fornitore},
    assicurazione = ${parsedData.data.assicurazione}, 
    netto = ${parsedData.data.netto},
    ricarico = ${parsedData.data.ricarico}
    WHERE id = ${a.id}
  `;
    return {
      values: result.rows[0],
      success: true,
      errorsMessage: ''
    };
  } catch (error) {
    return {
      success: false,
      errorsMessage: "Database Error: Failed to Update Assicurazione: "+ error,
      errors: {},
    };
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
  const clientiByIndirizzo = await fetchFilteredClienti(c.indirizzo, 1);
  const clientiByCap = await fetchFilteredClienti(c.cap, 1);
  const clientiByCf = await fetchFilteredClienti(c.cf, 1);
  const clientiByDataDiNascita = await fetchFilteredClienti(moment(c.data_di_nascita).format('YYYY-MM-DD'), 1);
  const allClienti = [
    ...clientiByNome.values,
    ...clientiByCognome.values,
    ...clientiByEmail.values,
    ...clientiByTel.values,
    ...clientiByCitta.values,
    ...clientiByCollegato.values,
    ...clientiByProvenienza.values,
    ...clientiByTipo.values,
    ...clientiByIndirizzo.values,
    ...clientiByCap.values,
    ...clientiByCf.values,
    ...clientiByDataDiNascita.values,
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
    ? new Set(clientiByNome.values.map((cliente) => cliente.id))
    : allIds;
  const idsByCognome = c.cognome
    ? new Set(clientiByCognome.values.map((cliente) => cliente.id))
    : allIds;
  const idsByEmail = c.email
    ? new Set(clientiByEmail.values.map((cliente) => cliente.id))
    : allIds;
  const idsByTel = c.tel
    ? new Set(clientiByTel.values.map((cliente) => cliente.id))
    : allIds;
  const idsByCitta = c.citta
    ? new Set(clientiByCitta.values.map((cliente) => cliente.id))
    : allIds;
  const idsByCollegato = c.collegato
    ? new Set(clientiByCollegato.values.map((cliente) => cliente.id))
    : allIds;
  const idsByProvenienza = c.provenienza
    ? new Set(clientiByProvenienza.values.map((cliente) => cliente.id))
    : allIds;
  const idsByTipo = c.tipo
    ? new Set(clientiByTipo.values.map((cliente) => cliente.id))
    : allIds;
  const idsByIndirizzo = c.indirizzo
    ? new Set(clientiByIndirizzo.values.map((cliente) => cliente.id))
    : allIds;
  const idsByCap = c.cap
    ? new Set(clientiByCap.values.map((cliente) => cliente.id))
    : allIds;
  const idsByCf = c.cf
    ? new Set(clientiByCf.values.map((cliente) => cliente.id))
    : allIds;
  const idsByDataDiNascita = c.data_di_nascita
    ? new Set(clientiByDataDiNascita.values.map((cliente) => cliente.id))
    : allIds;

  // Compute the intersection of the IDs
  const intersectedIds = [...allIds].filter(
    (id) =>
      idsByNome.has(id) &&
      idsByCognome.has(id) &&
      idsByEmail.has(id) &&
      idsByTel.has(id) &&
      idsByCitta.has(id) &&
      idsByCollegato.has(id) &&
      idsByProvenienza.has(id) &&
      idsByTipo.has(id) &&
      idsByIndirizzo.has(id) &&
      idsByCap.has(id) &&
      idsByCf.has(id) &&
      idsByDataDiNascita.has(id)
  );

  ////console.log("intersectedIds: ", intersectedIds);

  // Retrieve the clients corresponding to the intersected IDs
  const clientiMap = new Map<string, Cliente>();
  for (const cliente of allClienti) {
    if (intersectedIds.includes(cliente.id)) {
      clientiMap.set(cliente.id, cliente);
    }
  }

  const intersectedClienti = Array.from(clientiMap.values()).map( c => new ClienteInputGroup(c.nome, c.cognome, c.note, c.citta, c.collegato, c.tipo, c.data_di_nascita, c.tel, c.email, c.provenienza, c.indirizzo, c.cap, c.cf, c.id));
  //console.log("intersectedClienti: ", intersectedClienti);
  return intersectedClienti;
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

// #### DELETE BY ID ####
export const deleteServizioATerraById = async (id: string): Promise<void> => {

  try {
   await sql.query(
    `DELETE FROM servizi_a_terra WHERE id = $1`,
    [id]
   );
  } catch (error) {
   console.error('Database Error:', error);
   throw new Error('Failed to delete servizio a terra by id.');
  }
 };
 export const deleteVoloById = async (id: string): Promise<void> => {
 
   try {
    await sql.query(
      `DELETE FROM voli WHERE id = $1`,
      [id]
    );
   } catch (error) {
     console.error('Database Error:', error);
     throw new Error('Failed to delete volo by id.');
   }
 };
 export const deleteAssicurazioneById = async (id: string): Promise<void> => {
 
   try {
     await sql.query(
      `DELETE FROM assicurazioni WHERE id = $1`,
      [id]
    );
   } catch (error) {
     console.error('Database Error:', error);
     throw new Error('Failed to delete assicurazione by id.');
   }
 };