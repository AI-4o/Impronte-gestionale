"use server"; // IMPORTANTE: server actions devono essere precedute da 'use server' altrimenti bisogna dichiararlo per ciascuna!!

import { z } from "zod";
import { sql } from "@vercel/postgres";
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

export type InvoiceState = State<{
  customerId: string;
  amount: string;
  status: string;
}>;

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z
    .string()
    .min(4, { message: "customer name should be at least 4 characters long" }),
  amount: z.coerce
    .number({ message: "invalid format" })
    .gt(0, "amount must be greater than zero!"),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

// ### DELETE GENERAL ENTITY ###
export const deleteEntity = async (id: string, entityTableName: string) => {
  console.log("action deleteEntity", { id, entityTableName });

  try {
    // Handle dependent deletions based on the entityTableName
    switch (entityTableName) {
      case 'clienti':
        // Delete related pratiche
        await sql`DELETE FROM pratiche WHERE id_cliente = ${id}`;
        // Delete preventivi associated with the cliente
        const preventiviClienti = await sql`SELECT id FROM preventivi WHERE id_cliente = ${id}`;
        for (const prev of preventiviClienti.rows) {
          await deleteEntity(prev.id, 'preventivi');
        }
        break;

      case 'fornitori':
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

      case 'preventivi':
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

      case 'destinazioni':
        // Delete related preventivo_mostrare_cliente
        await sql`DELETE FROM preventivo_mostrare_cliente WHERE id_destinazione = ${id}`;
        // Delete related servizi_a_terra
        await sql`DELETE FROM servizi_a_terra WHERE id_destinazione = ${id}`;
        break;

      case 'banche':
        // Delete related incassi_partecipanti
        await sql`DELETE FROM incassi_partecipanti WHERE id_banca = ${id}`;
        // Delete related pagamenti_assicurazioni
        await sql`DELETE FROM pagamenti_assicurazioni WHERE id_banca = ${id}`;
        // Delete related pagamenti_voli
        await sql`DELETE FROM pagamenti_voli WHERE id_banca = ${id}`;
        // Delete related pagamenti_servizi_a_terra
        await sql`DELETE FROM pagamenti_servizi_a_terra WHERE id_banca = ${id}`;
        break;

      case 'assicurazioni':
        // Delete related pagamenti_assicurazioni
        await sql`DELETE FROM pagamenti_assicurazioni WHERE id_assicurazione = ${id}`;
        break;

      case 'voli':
        // Delete related pagamenti_voli
        await sql`DELETE FROM pagamenti_voli WHERE id_volo = ${id}`;
        break;

      case 'servizi_a_terra':
        // Delete related pagamenti_servizi_a_terra
        await sql`DELETE FROM pagamenti_servizi_a_terra WHERE id_servizio_a_terra = ${id}`;
        break;

      case 'partecipanti':
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
    console.error('Delete error:', error);
    return { message: `Database Error: Failed to delete from table ${entityTableName}.` };
  }

  revalidatePath(`/dashboard/${entityTableName}`);
};

// ### CREATE ENTITY ###

export const createCliente = async (
  prevState: State<Cliente>,
  formData: FormData
) => {
  console.log("action createCliente", {
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });

  const parsedData = schemas.ClienteSchema.safeParse({
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  try {
    await sql`
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
  } catch (error) {
    console.log("db error: ", error);
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath("/dashboard/clienti");
  redirect("/dashboard/clienti");
};
export async function createDestinazione(
  prevState: State<Destinazione>,
  formData: FormData
) {
  const parsedData = schemas.DestinazioneSchema.safeParse({
    nome: formData.get("nome"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Destinazione.",
    };
  }

  try {
    await sql`
    INSERT INTO destinazioni (nome)
    VALUES (${parsedData.data.nome})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Destinazione.",
    };
  }
  revalidatePath("/dashboard/destinazioni");
  redirect("/dashboard/destinazioni");
}
export async function createPreventivo(
  prevState: State<Preventivo>,
  formData: FormData
) {
  const parsedData = schemas.PreventivoSchema.safeParse({
    id_fornitore: formData.get("id_fornitore"),
    id_cliente: formData.get("id_cliente"),
    email: formData.get("email"),
    numero_di_telefono: formData.get("numero_di_telefono"),
    note: formData.get("note"),
    riferimento: formData.get("riferimento"),
    operatore: formData.get("operatore"),
    feedback: formData.get("feedback"),
    adulti: formData.get("adulti"),
    bambini: formData.get("bambini"),
    data_partenza: formData.get("data_partenza"),
    data: formData.get("data"),
    numero_preventivo: formData.get("numero_preventivo"),
    confermato: formData.get("confermato"),
    stato: formData.get("stato"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Preventivo.",
    };
  }

  try {
    await sql`
    INSERT INTO preventivi (id_fornitore, id_cliente, email, numero_di_telefono, note, riferimento, operatore, feedback, adulti, bambini, data_partenza, data, numero_preventivo, confermato, stato)
    VALUES (${parsedData.data.id_fornitore}, ${parsedData.data.id_cliente}, ${parsedData.data.email}, ${parsedData.data.numero_di_telefono}, ${parsedData.data.note}, ${parsedData.data.riferimento}, ${parsedData.data.operatore}, ${parsedData.data.feedback}, ${parsedData.data.adulti}, ${parsedData.data.bambini}, ${parsedData.data.data_partenza}, ${parsedData.data.data}, ${parsedData.data.numero_preventivo}, ${parsedData.data.confermato}, ${parsedData.data.stato})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Preventivo.",
    };
  }
  revalidatePath("/dashboard/preventivi");
  redirect("/dashboard/preventivi");
}
export async function createFornitore(
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
      message: "Missing Fields. Failed to Create Fornitore.",
    };
  }

  try {
    await sql`
    INSERT INTO fornitori (nome, valuta)
    VALUES (${parsedData.data.nome}, ${parsedData.data.valuta})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Fornitore.",
    };
  }
  revalidatePath("/dashboard/fornitori");
  redirect("/dashboard/fornitori");
}
export async function createBanca(prevState: State<Banca>, formData: FormData) {
  const parsedData = schemas.BancaSchema.safeParse({
    nome: formData.get("nome"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Banca.",
    };
  }

  try {
    await sql`
    INSERT INTO banche (nome)
    VALUES (${parsedData.data.nome})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Banca.",
    };
  }
  revalidatePath("/dashboard/banche");
  redirect("/dashboard/banche");
}
export async function createServizioATerra(
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
    servizio_aggiuntivi: formData.get("servizio_aggiuntivi"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Servizio A Terra.",
    };
  }

  try {
    await sql`
    INSERT INTO servizi_a_terra (id_preventivo, id_fornitore, id_destinazione, descrizione, data, numero_notti, totale, valuta, cambio, ricarico, servizio_aggiuntivi)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.id_destinazione}, ${parsedData.data.descrizione}, ${parsedData.data.data}, ${parsedData.data.numero_notti}, ${parsedData.data.totale}, ${parsedData.data.valuta}, ${parsedData.data.cambio}, ${parsedData.data.ricarico}, ${parsedData.data.servizio_aggiuntivi})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Servizio A Terra.",
    };
  }
  revalidatePath("/dashboard/servizi_a_terra");
  redirect("/dashboard/servizi_a_terra");
}
export async function createVolo(prevState: State<Volo>, formData: FormData) {
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
      message: "Missing Fields. Failed to Create Volo.",
    };
  }

  try {
    await sql`
    INSERT INTO voli (id_preventivo, id_fornitore, compagnia_aerea, descrizione, data_partenza, data_arrivo, totale, valuta, cambio, ricarico)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.compagnia_aerea}, ${parsedData.data.descrizione}, ${parsedData.data.data_partenza}, ${parsedData.data.data_arrivo}, ${parsedData.data.totale}, ${parsedData.data.valuta}, ${parsedData.data.cambio}, ${parsedData.data.ricarico})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Volo.",
    };
  }
  revalidatePath("/dashboard/voli");
  redirect("/dashboard/voli");
}
export async function createPagamentoServizioATerra(prevState: State<PagamentoServizioATerra>, formData: FormData) {
  const parsedData = schemas.PagamentoServiziATerraSchema.safeParse({
    id_banca: formData.get("id_banca"),
    id_servizio_a_terra: formData.get("id_servizio_a_terra"),
    id_fornitore: formData.get("id_fornitore"),
    data_scadenza: formData.get("data_scadenza"),
    data_incasso: formData.get("data_incasso"),
    importo: formData.get("importo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Pagamento Servizio A Terra.",
    };
  }

  try {
    await sql`
    INSERT INTO pagamento_servizi_a_terra (id_banca, id_servizio_a_terra, id_fornitore, data_scadenza, data_incasso, importo)
    VALUES (${parsedData.data.id_banca}, ${parsedData.data.id_servizio_a_terra}, ${parsedData.data.id_fornitore}, ${parsedData.data.data_scadenza}, ${parsedData.data.data_incasso}, ${parsedData.data.importo})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Pagamento Servizio A Terra.",
    };
  }
  revalidatePath("/dashboard/pagamenti_servizi_a_terra");
  redirect("/dashboard/pagamenti_servizi_a_terra");
}
export async function createPagamentoVolo(prevState: State<PagamentoVolo>, formData: FormData) {
  const parsedData = schemas.PagamentoVoliSchema.safeParse({
    id_banca: formData.get("id_banca"),
    id_volo: formData.get("id_volo"),
    id_fornitore: formData.get("id_fornitore"),
    data_scadenza: formData.get("data_scadenza"),
    data_incasso: formData.get("data_incasso"),
    importo: formData.get("importo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Pagamento Volo.",
    };
  }

  try {
    await sql`
    INSERT INTO pagamento_voli (id_banca, id_volo, id_fornitore, data_scadenza, data_incasso, importo)
    VALUES (${parsedData.data.id_banca}, ${parsedData.data.id_volo}, ${parsedData.data.id_fornitore}, ${parsedData.data.data_scadenza}, ${parsedData.data.data_incasso}, ${parsedData.data.importo})
  `;
  } catch (error) {
    return {
      ...prevState, 
      dbError: "Database Error: Failed to Create Pagamento Volo.",
    };
  }
  revalidatePath("/dashboard/pagamenti_voli");
  redirect("/dashboard/pagamenti_voli");
}
export async function createPagamentoAssicurazione(prevState: State<PagamentoAssicurazione>, formData: FormData) {
  const parsedData = schemas.PagamentoAssicurazioneSchema.safeParse({
    id_banca: formData.get("id_banca"),
    id_fornitore: formData.get("id_fornitore"),
    id_assicurazione: formData.get("id_assicurazione"),
    data_scadenza: formData.get("data_scadenza"),
    data_incasso: formData.get("data_incasso"),
    importo: formData.get("importo"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Pagamento Assicurazione.",
    };
  }

  try {
    await sql`
    INSERT INTO pagamento_assicurazione (id_banca, id_fornitore, id_assicurazione, data_scadenza, data_incasso, importo)
    VALUES (${parsedData.data.id_banca}, ${parsedData.data.id_fornitore}, ${parsedData.data.id_assicurazione}, ${parsedData.data.data_scadenza}, ${parsedData.data.data_incasso}, ${parsedData.data.importo})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Pagamento Assicurazione.",
    };
  }
  revalidatePath("/dashboard/pagamenti_assicurazione");
  redirect("/dashboard/pagamenti_assicurazione");
}
export async function createPratica(prevState: State<Pratica>, formData: FormData) {
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
      message: "Missing Fields. Failed to Create Pratica.",
    };
  }

  try {
    await sql`
    INSERT INTO pratiche (id_cliente, id_preventivo, data_conferma, data_partenza, data_rientro, note, numero_passeggeri, totale)
    VALUES (${parsedData.data.id_cliente}, ${parsedData.data.id_preventivo}, ${parsedData.data.data_conferma}, ${parsedData.data.data_partenza}, ${parsedData.data.data_rientro}, ${parsedData.data.note}, ${parsedData.data.numero_passeggeri}, ${parsedData.data.totale})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Pratica.",
    };
  }
  revalidatePath("/dashboard/pratiche");
  redirect("/dashboard/pratiche");
}
export async function createPartecipante(prevState: State<Partecipante>, formData: FormData) {
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
      message: "Missing Fields. Failed to Create Partecipante.",
    };
  }

  try {
    await sql`
    INSERT INTO partecipanti (id_preventivo, nome, cognome, tot_quota)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.nome}, ${parsedData.data.cognome}, ${parsedData.data.tot_quota})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Partecipante.",
    };
  }
  revalidatePath("/dashboard/partecipanti");
  redirect("/dashboard/partecipanti");
}
export async function createIncassoPartecipante(prevState: State<IncassoPartecipante>, formData: FormData) {
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
      message: "Missing Fields. Failed to Create Incasso Partecipante.",
    };
  }

  try {
    await sql`
    INSERT INTO incassi_partecipanti (id_partecipante, id_banca, data_scadenza, data_incasso, importo)
    VALUES (${parsedData.data.id_partecipante}, ${parsedData.data.id_banca}, ${parsedData.data.data_scadenza}, ${parsedData.data.data_incasso}, ${parsedData.data.importo})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Incasso Partecipante.",
    };
  }
  revalidatePath("/dashboard/incassi_partecipanti");
  redirect("/dashboard/incassi_partecipanti");
}
export async function createAssicurazione(prevState: State<Assicurazione>, formData: FormData) {
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
      message: "Missing Fields. Failed to Create Assicurazione.",
    };
  }

  try {
    await sql`
    INSERT INTO assicurazioni (id_preventivo, id_fornitore, assicurazione, netto, ricarico)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_fornitore}, ${parsedData.data.assicurazione}, ${parsedData.data.netto}, ${parsedData.data.ricarico})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Assicurazione.",
    };
  }
  revalidatePath("/dashboard/assicurazioni");
  redirect("/dashboard/assicurazioni");
}
export async function createPreventivoMostrareCliente(
  prevState: State<PreventivoMostrareCliente>,
  formData: FormData
) {
  const parsedData = schemas.PreventivoMostrareClienteSchema.safeParse({
    id_preventivo: formData.get("id_preventivo"),
    id_destinazione: formData.get("id_destinazione"),
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
      message: "Missing Fields. Failed to Create Preventivo Mostrare Cliente.",
    };
  }

  try {
    await sql`
    INSERT INTO preventivi_mostrare_cliente (id_preventivo, id_destinazione, descrizione, tipo, costo_individuale, importo_vendita, totale)
    VALUES (${parsedData.data.id_preventivo}, ${parsedData.data.id_destinazione}, ${parsedData.data.descrizione}, ${parsedData.data.tipo}, ${parsedData.data.costo_individuale}, ${parsedData.data.importo_vendita}, ${parsedData.data.totale})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Preventivo Mostrare Cliente.",
    };
  }
  revalidatePath("/dashboard/preventivi-mostrare-cliente");
  redirect("/dashboard/preventivi-mostrare-cliente");
}

// ### UPDATE ENTITY ###
export const updateCliente = async (
  prevState: State<Cliente>,
  formData: FormData
) => {
  console.log("prevState: ", prevState);
  console.log("action updateCliente", {
    id: prevState,
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });

  const parsedData = schemas.ClienteSchema.safeParse({
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
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
    WHERE id = ${prevState.values?.id}
    `;
  } catch (error) {
    console.log("db error: ", error);
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath("/dashboard/clienti");
  redirect("/dashboard/clienti");
};
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
export async function updatePreventivo(
  prevState: State<Preventivo>,
  formData: FormData
) {
  const parsedData = schemas.PreventivoSchema.safeParse({
    id_fornitore: formData.get("id_fornitore"),
    id_cliente: formData.get("id_cliente"),
    email: formData.get("email"),
    numero_di_telefono: formData.get("numero_di_telefono"),
    note: formData.get("note"),
    riferimento: formData.get("riferimento"),
    operatore: formData.get("operatore"),
    feedback: formData.get("feedback"),
    adulti: formData.get("adulti"),
    bambini: formData.get("bambini"),
    data_partenza: formData.get("data_partenza"),
    data: formData.get("data"),
    numero_preventivo: formData.get("numero_preventivo"),
    confermato: formData.get("confermato"),
    stato: formData.get("stato"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Preventivo.",
    };
  }

  try {
    await sql`
    UPDATE preventivi
    SET id_fornitore = ${parsedData.data.id_fornitore},
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
        confermato = ${parsedData.data.confermato},
        stato = ${parsedData.data.stato}
    WHERE id = ${prevState.values?.id}
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Update Preventivo.",
    };
  }
  revalidatePath("/dashboard/preventivi");
  redirect("/dashboard/preventivi");
}
export async function updateFornitore(
  prevState: State<Fornitore> ,
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
export async function updateBanca(
  prevState: State<Banca> ,
  formData: FormData
) {
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
  prevState: State<ServizioATerra> ,
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
    servizio_aggiuntivi: formData.get("servizio_aggiuntivi"),
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
        servizio_aggiuntivi = ${parsedData.data.servizio_aggiuntivi}
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
export async function updateVolo(
  prevState: State<Volo> ,
  formData: FormData
) {
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
  prevState: State<Assicurazione> ,
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
  prevState: State<PreventivoMostrareCliente> ,
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
  prevState: State<Partecipante> ,
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
  prevState: State<IncassoPartecipante> ,
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
  prevState: State<PagamentoServizioATerra> ,
  formData: FormData
) {
  const parsedData = schemas.PagamentoServiziATerraSchema.safeParse({
    id_servizio_a_terra: formData.get("id_servizio_a_terra"),
    id_fornitore: formData.get("id_fornitore"),
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
        id_fornitore = ${parsedData.data.id_fornitore},
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
    id_fornitore: formData.get("id_fornitore"),
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
        id_fornitore = ${parsedData.data.id_fornitore},
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
