"use server"; // IMPORTANTE: server actions devono essere precedute da 'use server' altrimenti bisogna dichiararlo per ciascuna!!

import { z } from "zod";
import { QueryResultRow, sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import {
  Assicurazione,
  Banca,
  Cliente,
  Destinazione,
  Fornitore,
  IncassoPartecipante,
  PagamentoAssicurazione,
  PagamentoServizioATerra,
  PagamentoVolo,
  Partecipante,
  Pratica,
  Preventivo,
  PreventivoMostrareCliente,
  ServizioATerra,
  Volo,
} from "../definitions";
import * as schemas from "./entity-zod-schemas";
import { fetchDestinazioneByName, fetchFilteredClienti, fetchFilteredPreventivi, fetchFornitoreByName, fetchPreventiviByCliente } from "../data";
import { AssicurazioneInputGroup, ClienteInputGroup, Data, PreventivoInputGroup, ServizioATerraInputGroup, VoloInputGroup } from "@/app/dashboard/(overview)/general-interface-create/general-interface.defs";
import { formatDate } from "../utils";

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
  console.log("action deleteEntity", { id, entityTableName });

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

export const createCliente = async (c: ClienteInputGroup): Promise<ClienteInputGroup | any> => {
  const parsedData = schemas.ClienteSchema.safeParse({
    nome:
      c.nome ??
      (() => {
        throw new Error("Nome must not be null");
      })(),
    cognome:
      c.cognome ??
      (() => {
        throw new Error("Cognome must not be null");
      })(),
    note: c.note,
    tipo: c.tipo,
    data_di_nascita:
      formatDate(c.data_di_nascita) ??
      (() => {
        throw new Error("Data di nascita must not be null");
      })(),
    tel: c.tel,
    email:
      c.email ??
      (() => {
        throw new Error("Email must not be null");
      })(),
    citta: c.citta,
    collegato: c.collegato,
    provenienza: c.provenienza,
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Cliente.",
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
    RETURNING *;
    ON CONFLICT (nome, cognome) DO NOTHING;
  `;
    console.log("result of createCliente: ", result);
    return result;
  } catch (error) {
    console.log("db error: ", error);
    return {
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Cliente.",
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
    email:
      p.email ??
      (() => {
        throw new Error("Email must not be null");
      })(), // TODO: email di chi?
    numero_di_telefono: c.tel,
    note: p.note,
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
    console.log("parsedData.error", parsedData.error);
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
        email, 
        numero_di_telefono, 
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
        ${parsedData.data.email}, 
        ${parsedData.data.numero_di_telefono}, 
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
    console.log('result of createPreventivo: ', result);
    return result;
  } catch (error) {
    console.log("db error: ", error);
    return {
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Preventivo.",
    };
  }
};
export const createServizioATerra = async (s: ServizioATerraInputGroup, id_preventivo: string, servizio_aggiuntivo: boolean) => {

  const fornitore = await fetchFornitoreByName(s.fornitore);
  const destinazione = await fetchDestinazioneByName(s.destinazione);
  console.log('fornitore: ', fornitore);
  console.log('destinazione: ', destinazione);
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
    data: formatDate(s.data),
    numero_notti: s.numero_notti,
    totale: s.totale,
    valuta: s.valuta,
    cambio: s.cambio,
    ricarico: s.ricarico,
    servizio_aggiuntivo: servizio_aggiuntivo,
  });

  if (!parsedData.success) {
    return {
      message: "Failed to Create Servizio A Terra.",
    };
  }
  try {
    const result = await sql`
    INSERT INTO servizi_a_terra (id_preventivo, id_fornitore, id_destinazione, descrizione, data, numero_notti, totale, valuta, cambio, ricarico, servizio_aggiuntivo)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.id_destinazione}, ${parsedData.data.descrizione}, ${parsedData.data.data}, ${parsedData.data.numero_notti}, ${parsedData.data.totale}, ${parsedData.data.valuta}, ${parsedData.data.cambio}, ${parsedData.data.ricarico}, ${parsedData.data.servizio_aggiuntivo})
    RETURNING *;
    `;
    console.log('result of createServizioATerra: ', result);
    return result;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Servizio A Terra.",
    };
  }
}
export const createVolo = async (v: VoloInputGroup, id_preventivo: string) => {
  const fornitore = await fetchFornitoreByName(v.fornitore);
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
    data_partenza: formatDate(v.data_partenza),
    data_arrivo: formatDate(v.data_arrivo),
    totale: v.totale,
    valuta: v.valuta,
    cambio: v.cambio,
    ricarico: v.ricarico,
  });

  if (!parsedData.success) {
    return {
      message: "Failed to Create Volo due to a parsing Zod error.",
    };
  }
  try {
    const result = await sql`
    INSERT INTO voli (id_preventivo, id_fornitore, compagnia_aerea, descrizione, data_partenza, data_arrivo, totale, valuta, cambio, ricarico)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.compagnia_aerea}, ${parsedData.data.descrizione}, ${parsedData.data.data_partenza}, ${parsedData.data.data_arrivo}, ${parsedData.data.totale}, ${parsedData.data.valuta}, ${parsedData.data.cambio}, ${parsedData.data.ricarico})
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
  console.log('fornitore: ', fornitore);
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
    ricarico: a.ricarico,
  });
  if (!parsedData.success) {
    return {
      message: "Failed to Create Assicurazione due to a parsing Zod error.",
    };
  }
  try {
    const result = await sql`
    INSERT INTO assicurazioni (id_preventivo, id_fornitore, assicurazione, netto, ricarico)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.assicurazione}, ${parsedData.data.netto}, ${parsedData.data.ricarico})
    RETURNING *;
    `;
    console.log('result of createAssicurazione: ', result);
    return result;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Assicurazione.",
    };
  }
}

// ### GET ENTITY BY PREVENTIVO ###
export const getPreventivoById = async (id_preventivo: string) => {
  const result = await sql`SELECT * FROM preventivi WHERE id = ${id_preventivo}`;
}

export const getServiziATerraByPreventivoId = async (id_preventivo: string) => {
  console.log("id_preventivo: ", id_preventivo);
  const result = await sql`SELECT * FROM servizi_a_terra WHERE id_preventivo = ${id_preventivo}`;
  console.log('LKJHGFD: ', result);
  
  return result;
}
export const getServiziAggiuntiviByPreventivoId = async (id_preventivo: string) => {
  const result = await sql`SELECT * FROM servizi_a_terra WHERE id_preventivo = ${id_preventivo} AND servizio_aggiuntivo = true`;
  return result;
}
export const getVoliByPreventivoId = async (id_preventivo: string) => {
  const result = await sql`SELECT * FROM voli WHERE id_preventivo = ${id_preventivo}`;
  return result;
}
export const getAssicurazioniByPreventivoId = async (id_preventivo: string) => {
  const result = await sql`SELECT * FROM assicurazioni WHERE id_preventivo = ${id_preventivo}`;
  return result;
}


// ## GET DESTINAZIONE BY ID
export const getDestinazioneById = async (id_destinazione: string) => {
  const result = await sql`SELECT * FROM destinazioni WHERE id = ${id_destinazione}`;
  return result;
}
export const getFornitoreById = async (id_fornitore: string) => {
  const result = await sql`SELECT * FROM fornitori WHERE id = ${id_fornitore}`;
  return result;
}

// ### UPDATE ENTITY ###
export const updateCliente = async (
  c: ClienteInputGroup,
  id: string
) => {
  const parsedData = schemas.ClienteSchema.safeParse({
    id: id,
    nome:
      c.nome ??
      (() => {
        throw new Error("Nome must not be null");
      })(),
    cognome:
      c.cognome ??
      (() => {
        throw new Error("Cognome must not be null");
      })(),
    note: c.note,
    tipo: c.tipo,
    data_di_nascita:
      formatDate(c.data_di_nascita) ??
      (() => {
        throw new Error("Data di nascita must not be null");
      })(),
    tel: c.tel,
    email:
      c.email ??
      (() => {
        throw new Error("Email must not be null");
      })(),
    citta: c.citta,
    collegato: c.collegato,
    provenienza: c.provenienza,
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Cliente.",
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
    return true;
  } catch (error) {
    console.log("db error: ", error);
    return {
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Invoice.",
    };
  }
};
export const updatePreventivo = async (p: PreventivoInputGroup, id: string, idCliente: string) => {
  const parsedData = schemas.PreventivoSchema.safeParse({
    id:
      id ??
      (() => {
        throw new Error("ID must not be null");
      })(),

    id_cliente: idCliente,
    email:
      p.email ??
      (() => {
        throw new Error("Email must not be null");
      })(),
    numero_di_telefono: p.numero_di_telefono,
    note: p.note,
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
    console.log("parsedData.error", parsedData.error);
    return {
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Preventivo.",
    };
  }
  try {
    const result = await sql`
    UPDATE preventivi SET 
    id_cliente = ${parsedData.data.id_cliente}, 
    email = ${parsedData.data.email}, 
    numero_di_telefono = ${parsedData.data.numero_di_telefono}, 
    note = ${parsedData.data.note}, 
    riferimento = ${parsedData.data.riferimento}, 
    operatore = ${parsedData.data.operatore}, 
    feedback = ${parsedData.data.feedback}, 
    adulti = ${parsedData.data.adulti}, 
    bambini = ${parsedData.data.bambini}, 
    data_partenza = ${parsedData.data.data_partenza}, 
    data = ${parsedData.data.data}, 
    numero_preventivo = ${parsedData.data.numero_preventivo}, 
    stato = ${parsedData.data.stato}
    WHERE id = ${id}
  `;
    console.log("SUCCESS UPDATING PREVENTIVO");
    return result;
  } catch (error) {
    console.log("db error: ", error);
    return {
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Preventivo.",
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
    console.log("error: ", error);
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

/*console.log(
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

  //console.log("intersectedIds: ", intersectedIds);

  // Retrieve the clients corresponding to the intersected IDs
  const clientiMap = new Map<string, Cliente>();
  for (const cliente of allClienti) {
    if (intersectedIds.includes(cliente.id)) {
      clientiMap.set(cliente.id, cliente);
    }
  }

  const intersectedClienti = Array.from(clientiMap.values()).map( c => new ClienteInputGroup(c.nome, c.cognome, c.note, c.citta, c.collegato, c.tipo, c.data_di_nascita, c.tel, c.email, c.provenienza, c.id));
  console.log("intersectedClienti: ", intersectedClienti);
  return intersectedClienti;
};

export const searchPreventivi = async (clienteId: string): Promise<PreventivoInputGroup[]> => {
  const preventiviByCliente = await fetchPreventiviByCliente(clienteId);
  const preventivi = preventiviByCliente.map(p => new PreventivoInputGroup(p.numero_preventivo, p.brand, p.email, p.riferimento, p.operatore, p.feedback, p.note, p.numero_di_telefono, p.adulti, p.bambini, p.data_partenza, p.data, p.stato, p.id));
  return preventivi;
} 


export async function updateDestinazione(
  prevState: State<Destinazione>,
  formData: FormData
) {
  console.log("prevState: ", prevState, "formData: ", formData.get("nome"));

  const parsedData = schemas.DestinazioneSchema.safeParse({
    nome: formData.get("nome"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Destinazione.",
    };
  }

  try {
    await sql`
    UPDATE destinazioni
    SET nome = ${parsedData.data.nome}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Destinazione.",
    };
  }
  revalidatePath("/dashboard/destinazioni");
  redirect("/dashboard/destinazioni");
}


export async function updateFornitore(
  prevState: State<Fornitore>,
  formData: FormData
) {
  const parsedData = schemas.FornitoreSchema.safeParse({
    nome: formData.get("nome"),
    valuta: formData.get("valuta"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Fornitore.",
    };
  }

  try {
    await sql`
    UPDATE fornitori
    SET nome = ${parsedData.data.nome},
        valuta = ${parsedData.data.valuta}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Fornitore.",
    };
  }
  revalidatePath("/dashboard/fornitori");
  redirect("/dashboard/fornitori");
}
export async function updateBanca(prevState: State<Banca>, formData: FormData) {
  const parsedData = schemas.BancaSchema.safeParse({
    nome: formData.get("nome"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Banca.",
    };
  }

  try {
    await sql`
    UPDATE banche
    SET nome = ${parsedData.data.nome}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Banca.",
    };
  }
  revalidatePath("/dashboard/banche");
  redirect("/dashboard/banche");
}
export async function updateServizioATerra(
  prevState: State<ServizioATerra>,
  formData: FormData
) {
  const parsedData = schemas.ServizioATerraSchema.safeParse({
    id_preventivo: formData.get("id_preventivo"),
    id_fornitore: formData.get("id_fornitore"),
    id_destinazione: formData.get("id_destinazione"),
    descrizione: formData.get("descrizione"),
    data: formData.get("data"),
    numero_notti: formData.get("numero_notti"),
    totale: formData.get("totale"),
    valuta: formData.get("valuta"),
    cambio: formData.get("cambio"),
    ricarico: formData.get("ricarico"),
    servizio_aggiuntivo: formData.get("servizio_aggiuntivo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Servizio A Terra.",
    };
  }

  try {
    await sql`
    UPDATE servizi_a_terra
    SET id_preventivo = ${parsedData.data.id_preventivo},
        id_fornitore = ${parsedData.data.id_fornitore},
        id_destinazione = ${parsedData.data.id_destinazione},
        descrizione = ${parsedData.data.descrizione},
        data = ${parsedData.data.data},
        numero_notti = ${parsedData.data.numero_notti},
        totale = ${parsedData.data.totale},
        valuta = ${parsedData.data.valuta},
        cambio = ${parsedData.data.cambio},
        ricarico = ${parsedData.data.ricarico},
        servizio_aggiuntivo = ${parsedData.data.servizio_aggiuntivo}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Servizio A Terra.",
    };
  }
  revalidatePath("/dashboard/servizi-a-terra");
  redirect("/dashboard/servizi-a-terra");
}
export async function updateVolo(prevState: State<Volo>, formData: FormData) {
  const parsedData = schemas.VoloSchema.safeParse({
    id_preventivo: formData.get("id_preventivo"),
    id_fornitore: formData.get("id_fornitore"),
    compagnia_aerea: formData.get("compagnia_aerea"),
    descrizione: formData.get("descrizione"),
    data_partenza: formData.get("data_partenza"),
    data_arrivo: formData.get("data_arrivo"),
    totale: formData.get("totale"),
    valuta: formData.get("valuta"),
    cambio: formData.get("cambio"),
    ricarico: formData.get("ricarico"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Volo.",
    };
  }

  try {
    await sql`
    UPDATE voli
    SET id_preventivo = ${parsedData.data.id_preventivo},
        id_fornitore = ${parsedData.data.id_fornitore},
        compagnia_aerea = ${parsedData.data.compagnia_aerea},
        descrizione = ${parsedData.data.descrizione},
        data_partenza = ${parsedData.data.data_partenza},
        data_arrivo = ${parsedData.data.data_arrivo},
        totale = ${parsedData.data.totale},
        valuta = ${parsedData.data.valuta},
        cambio = ${parsedData.data.cambio},
        ricarico = ${parsedData.data.ricarico}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Volo.",
    };
  }
  revalidatePath("/dashboard/voli");
  redirect("/dashboard/voli");
}
export async function updateAssicurazione(
  prevState: State<Assicurazione>,
  formData: FormData
) {
  const parsedData = schemas.AssicurazioneSchema.safeParse({
    id_preventivo: formData.get("id_preventivo"),
    id_fornitore: formData.get("id_fornitore"),
    assicurazione: formData.get("assicurazione"),
    netto: formData.get("netto"),
    ricarico: formData.get("ricarico"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Assicurazione.",
    };
  }

  try {
    await sql`
    UPDATE assicurazioni
    SET id_preventivo = ${parsedData.data.id_preventivo},
        id_fornitore = ${parsedData.data.id_fornitore},
        assicurazione = ${parsedData.data.assicurazione},
        netto = ${parsedData.data.netto},
        ricarico = ${parsedData.data.ricarico}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Assicurazione.",
    };
  }
  revalidatePath("/dashboard/assicurazioni");
  redirect("/dashboard/assicurazioni");
}
export async function updatePreventivoMostrareCliente(
  prevState: State<PreventivoMostrareCliente>,
  formData: FormData
) {
  const parsedData = schemas.PreventivoMostrareClienteSchema.safeParse({
    id_destinazione: formData.get("id_destinazione"),
    id_preventivo: formData.get("id_preventivo"),
    descrizione: formData.get("descrizione"),
    tipo: formData.get("tipo"),
    costo_individuale: formData.get("costo_individuale"),
    importo_vendita: formData.get("importo_vendita"),
    totale: formData.get("totale"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Preventivo Mostrare Cliente.",
    };
  }

  try {
    await sql`
    UPDATE preventivi_mostrare_cliente
    SET id_destinazione = ${parsedData.data.id_destinazione},
        id_preventivo = ${parsedData.data.id_preventivo},
        descrizione = ${parsedData.data.descrizione},
        tipo = ${parsedData.data.tipo},
        costo_individuale = ${parsedData.data.costo_individuale},
        importo_vendita = ${parsedData.data.importo_vendita},
        totale = ${parsedData.data.totale}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Preventivo Mostrare Cliente.",
    };
  }
  revalidatePath("/dashboard/preventivi-mostrare-cliente");
  redirect("/dashboard/preventivi-mostrare-cliente");
}
export async function updatePartecipante(
  prevState: State<Partecipante>,
  formData: FormData
) {
  const parsedData = schemas.PartecipanteSchema.safeParse({
    id_preventivo: formData.get("id_preventivo"),
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    tot_quota: formData.get("tot_quota"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Partecipante.",
    };
  }

  try {
    await sql`
    UPDATE partecipanti
    SET id_preventivo = ${parsedData.data.id_preventivo},
        nome = ${parsedData.data.nome},
        cognome = ${parsedData.data.cognome},
        tot_quota = ${parsedData.data.tot_quota}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Partecipante.",
    };
  }
  revalidatePath("/dashboard/partecipanti");
  redirect("/dashboard/partecipanti");
}
export async function updateIncassoPartecipante(
  prevState: State<IncassoPartecipante>,
  formData: FormData
) {
  const parsedData = schemas.IncassoPartecipanteSchema.safeParse({
    id_partecipante: formData.get("id_partecipante"),
    id_banca: formData.get("id_banca"),
    data_scadenza: formData.get("data_scadenza"),
    data_incasso: formData.get("data_incasso"),
    importo: formData.get("importo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Incasso Partecipante.",
    };
  }

  try {
    await sql`
    UPDATE incassi_partecipanti
    SET id_partecipante = ${parsedData.data.id_partecipante},
        id_banca = ${parsedData.data.id_banca},
        data_scadenza = ${parsedData.data.data_scadenza},
        data_incasso = ${parsedData.data.data_incasso},
        importo = ${parsedData.data.importo}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Incasso Partecipante.",
    };
  }
  revalidatePath("/dashboard/incassi-partecipanti");
  redirect("/dashboard/incassi-partecipanti");
}
export async function updatePagamentoServizioATerra(
  prevState: State<PagamentoServizioATerra>,
  formData: FormData
) {
  const parsedData = schemas.PagamentoServiziATerraSchema.safeParse({
    id_servizio_a_terra: formData.get("id_servizio_a_terra"),
    id_banca: formData.get("id_banca"),
    data_scadenza: formData.get("data_scadenza"),
    data_incasso: formData.get("data_incasso"),
    importo: formData.get("importo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Pagamento Servizi A Terra.",
    };
  }

  try {
    await sql`
    UPDATE pagamenti_servizi_a_terra
    SET id_servizio_a_terra = ${parsedData.data.id_servizio_a_terra},
        id_banca = ${parsedData.data.id_banca},
        data_scadenza = ${parsedData.data.data_scadenza},
        data_incasso = ${parsedData.data.data_incasso},
        importo = ${parsedData.data.importo}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Pagamento Servizi A Terra.",
    };
  }
  revalidatePath("/dashboard/pagamenti-servizi-a-terra");
  redirect("/dashboard/pagamenti-servizi-a-terra");
}
export async function updatePagamentoVolo(
  prevState: State<PagamentoVolo>,
  formData: FormData
) {
  const parsedData = schemas.PagamentoVoliSchema.safeParse({
    id_volo: formData.get("id_volo"),
    id_banca: formData.get("id_banca"),
    data_scadenza: formData.get("data_scadenza"),
    data_incasso: formData.get("data_incasso"),
    importo: formData.get("importo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Pagamento Volo.",
    };
  }

  try {
    await sql`
    UPDATE pagamenti_voli
    SET id_volo = ${parsedData.data.id_volo},
        id_banca = ${parsedData.data.id_banca},
        data_scadenza = ${parsedData.data.data_scadenza},
        data_incasso = ${parsedData.data.data_incasso},
        importo = ${parsedData.data.importo}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Pagamento Volo.",
    };
  }
  revalidatePath("/dashboard/pagamenti-voli");
  redirect("/dashboard/pagamenti-voli");
}
export async function updatePagamentoAssicurazione(
  prevState: State<PagamentoAssicurazione>,
  formData: FormData
) {
  const parsedData = schemas.PagamentoAssicurazioneSchema.safeParse({
    id_assicurazione: formData.get("id_assicurazione"),
    id_banca: formData.get("id_banca"),
    data_scadenza: formData.get("data_scadenza"),
    data_incasso: formData.get("data_incasso"),
    importo: formData.get("importo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Pagamento Assicurazione.",
    };
  }

  try {
    await sql`
    UPDATE pagamenti_assicurazioni
    SET id_assicurazione = ${parsedData.data.id_assicurazione},
        id_banca = ${parsedData.data.id_banca},
        data_scadenza = ${parsedData.data.data_scadenza},
        data_incasso = ${parsedData.data.data_incasso},
        importo = ${parsedData.data.importo}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Pagamento Assicurazione.",
    };
  }
  revalidatePath("/dashboard/pagamenti-assicurazioni");
  redirect("/dashboard/pagamenti-assicurazioni");
}

export async function updatePratica(
  prevState: State<Pratica>,
  formData: FormData
) {
  const parsedData = schemas.PraticaSchema.safeParse({
    id_cliente: formData.get("id_cliente"),
    id_preventivo: formData.get("id_preventivo"),
    data_conferma: formData.get("data_conferma"),
    data_partenza: formData.get("data_partenza"),
    data_rientro: formData.get("data_rientro"),
    note: formData.get("note"),
    numero_passeggeri: formData.get("numero_passeggeri"),
    totale: formData.get("totale"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Pratica.",
    };
  }

  try {
    await sql`
    UPDATE pratiche
    SET 
        id_cliente = ${parsedData.data.id_cliente},
        id_preventivo = ${parsedData.data.id_preventivo},
        data_conferma = ${parsedData.data.data_conferma},
        data_partenza = ${parsedData.data.data_partenza},
        data_rientro = ${parsedData.data.data_rientro},
        note = ${parsedData.data.note},
        numero_passeggeri = ${parsedData.data.numero_passeggeri},
        totale = ${parsedData.data.totale}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Pratica.",
    };
  }
  revalidatePath("/dashboard/pratiche");
  redirect("/dashboard/pratiche");
}

export async function deleteInvoice(id: string, entityName: string) {
  try {
    await sql`DELETE FROM ${entityName} WHERE id = ${id}`;
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
  revalidatePath("/dashboard/invoices");
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
