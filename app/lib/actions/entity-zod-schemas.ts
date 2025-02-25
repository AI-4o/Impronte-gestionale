import { z } from "zod";
import valuteValues from "@/app/seed/valute.json";
import brandValues from "@/app/seed/brands.json";
import typesValues from "@/app/seed/fondamental-entities-types.json";

const valuteArray = valuteValues.valute;
const brandArray = brandValues.brand;
const typesArray = typesValues.types.map(type => type.tableName);

export const FundamentalEntitySchema = z.object({
  tableName: z.enum(typesArray as [string, ...string[]]),
  value: z.string().min(1, { message: "Value is required" })
});

export const ClienteSchema = z.object({
  email: z.string().email(),
  nome: z.string().optional(),
  cognome: z.string().optional(),
  note: z.string().nullable().optional(),
  tipo: z.string().nullable().optional(),
  data_di_nascita: z.string().nullable().optional(),
  indirizzo: z.string().nullable().optional(),
  cap: z.string().nullable().optional(),
  citta: z.string().nullable().optional(),
  cf: z.string().nullable().optional(),
  collegato: z.string().nullable().optional(),
  tel: z.string().nullable().optional(),
  provenienza: z.string().nullable().optional(),
  luogo_nascita: z.string().nullable().optional(),
  provincia_nascita: z.string().nullable().optional(),
  numero_passaporto: z.string().nullable().optional(),
  data_scadenza_passaporto: z.string().nullable().optional(),
  nazionalita: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  sesso: z.string().nullable().optional(),
});
export const DestinazioneSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
});
export const PreventivoSchema = z.object({
  id_cliente: z.string(),
  percentuale_ricarico: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  brand: z.enum(brandArray as [string, ...string[]]),
  riferimento: z.string().nullable().optional(),
  operatore: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  adulti: z.number().nullable().optional(),
  bambini: z.number().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_preventivo: z.string(),
  stato: z.string().nullable().optional(),
  tipo_viaggio: z.string().nullable().optional(),
  destinazione: z.string().nullable().optional(),
  note_operative: z.string().nullable().optional(),
});
export const UpdatePreventivoSchema = z.object({
  note: z.string().nullable().optional(),
  percentuale_ricarico: z.number().nullable().optional(),
  brand: z.enum(brandArray as [string, ...string[]]),
  riferimento: z.string().nullable().optional(),
  operatore: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  adulti: z.number().nullable().optional(),
  bambini: z.number().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  stato: z.enum(['da fare', 'in trattativa', 'confermato', 'inviato']),
  numero_preventivo: z.string().nullable(),
  tipo_viaggio: z.string().nullable().optional(),
  destinazione: z.string().nullable().optional(),
  note_operative: z.string().nullable().optional(),
});
export const ServizioATerraSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string().nullable().optional(),
  id_destinazione: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_notti: z.number().optional(),
  numero_camere: z.number().optional(),
  totale: z.number().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number().optional(),
  servizio_aggiuntivo: z.boolean(),
});
export const UpdateServizioATerraSchema = z.object({
  id_fornitore: z.string().nullable().optional(),
  id_destinazione: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_notti: z.number().optional(),
  numero_camere: z.number().optional(),
  totale: z.number().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number().optional(),
  servizio_aggiuntivo: z.boolean(),
});
export const VoloSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string().nullable().optional(),
  compagnia_aerea: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_arrivo: z.string().nullable().optional(),
  totale: z.number().optional(),
  ricarico: z.number().optional(),
  numero: z.number().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number().optional(),
});
export const UpdateVoloSchema = z.object({
  id_fornitore: z.string().nullable().optional(),
  compagnia_aerea: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_arrivo: z.string().nullable().optional(),
  totale: z.number().optional(),
  ricarico: z.number().optional(),
  numero: z.number().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number().optional(),
});
export const AssicurazioneSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string().nullable().optional(),
  assicurazione: z.string().optional(),
  netto: z.number().optional(),
  ricarico: z.number().optional(),
  numero: z.number().optional()
});
export const UpdateAssicurazioneSchema = z.object({
  id_fornitore: z.string().nullable().optional(),
  assicurazione: z.string().optional(),
  netto: z.number().optional(),
  ricarico: z.number().optional(),
  numero: z.number().optional()
});


export const PreventivoAlClienteSchema = z.object({
  id_preventivo: z.string(),
  descrizione_viaggio: z.string().optional(),
});
export const PreventivoAlClienteRowSchema = z.object({
  id_preventivo_al_cliente: z.string(),
  senza_assicurazione: z.boolean(),
  destinazione: z.string().optional(),
  descrizione: z.string().optional(),
  individuale: z.number().optional(),
  numero: z.number().optional(),
});
export const UpdatePreventivoAlClienteSchema = z.object({
  id: z.string(),
  descrizione_viaggio: z.string().optional(),
});
export const UpdatePreventivoAlClienteRowSchema = z.object({
  id: z.string(),
  id_preventivo_al_cliente: z.string(),
  senza_assicurazione: z.boolean(),
  destinazione: z.string().optional(),
  descrizione: z.string().optional(),
  individuale: z.number().optional(),
  numero: z.number().optional(),
});
export const PartecipanteSchema = z.object({
  id_preventivo: z.string(),
  nome: z.string().optional(),
  cognome: z.string().optional(),
  tot_quota: z.number().optional(),
});
export const IncassoPartecipanteSchema = z.object({
  id_partecipante: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number().optional(),
});
export const PagamentoServiziATerraSchema = z.object({
  id_servizio_a_terra: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number().optional(),
});
export const PagamentoVoliSchema = z.object({
  id_volo: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number().optional(),
});
export const PagamentoAssicurazioneSchema = z.object({
  id_fornitore: z.string(),
  id_assicurazione: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number().optional(),
});
export const PraticaSchema = z.object({
  id_cliente: z.string(),
  id_preventivo: z.string(),
  data_conferma: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_rientro: z.string().nullable().optional(),
  note: z.string().optional(),
  numero_passeggeri: z.number().optional()  ,
});
export const FornitoreSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
});
export const BancaSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
});
