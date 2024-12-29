import { z } from "zod";

export const valuteArray = ["EUR", "USD"];
export const brandArray = ["IWS", "INO", "ISE", "IMS", "BORN"];
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
});
export const DestinazioneSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
});
export const PreventivoSchema = z.object({
  id_cliente: z.string(),
  note: z.string().nullable().optional(),
  brand: z.enum(brandArray as [string, ...string[]]).nullable().optional(),
  riferimento: z.string().nullable().optional(),
  operatore: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  adulti: z.number().nullable().optional(),
  bambini: z.number().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_preventivo: z.string().optional(),
  stato: z.string().nullable().optional(),
});
export const UpdatePreventivoSchema = z.object({
  note: z.string().nullable().optional(),
  brand: z.enum(brandArray as [string, ...string[]]).nullable().optional(),
  riferimento: z.string().nullable().optional(),
  operatore: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  adulti: z.number().nullable().optional(),
  bambini: z.number().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  stato: z.enum(['da fare', 'in trattativa', 'confermato', 'inviato']),
  numero_preventivo: z.string().nullable().optional(),
});
export const ServizioATerraSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string().nullable().optional(),
  id_destinazione: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_notti: z.number(),
  numero_camere: z.number(),
  totale: z.number(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number(),
  servizio_aggiuntivo: z.boolean(),
});
export const UpdateServizioATerraSchema = z.object({
  id_fornitore: z.string().nullable().optional(),
  id_destinazione: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_notti: z.number(),
  numero_camere: z.number(),
  totale: z.number(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number(),
  servizio_aggiuntivo: z.boolean(),
});
export const VoloSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string().nullable().optional(),
  compagnia_aerea: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_arrivo: z.string().nullable().optional(),
  totale: z.number(),
  ricarico: z.number(),
  numero: z.number(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number(),
});
export const UpdateVoloSchema = z.object({
  id_fornitore: z.string().nullable().optional(),
  compagnia_aerea: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_arrivo: z.string().nullable().optional(),
  totale: z.number(),
  ricarico: z.number(),
  numero: z.number(),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
  cambio: z.number(),
});
export const AssicurazioneSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string().nullable().optional(),
  assicurazione: z.string(),
  netto: z.number(),
});
export const UpdateAssicurazioneSchema = z.object({
  id_fornitore: z.string().nullable().optional(),
  assicurazione: z.string(),
  netto: z.number(),
});


export const PreventivoMostrareClienteSchema = z.object({
  id_destinazione: z.string(),
  id_preventivo: z.string(),
  descrizione: z.string().nullable().optional(),
  tipo: z.enum(["destinazione", "volo", "assicurazione"]).optional(),
  costo_individuale: z.number(),
  importo_vendita: z.number(),
  totale: z.number(),
});
export const PartecipanteSchema = z.object({
  id_preventivo: z.string(),
  nome: z.string().optional(),
  cognome: z.string().optional(),
  tot_quota: z.number(),
});
export const IncassoPartecipanteSchema = z.object({
  id_partecipante: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number(),
});
export const PagamentoServiziATerraSchema = z.object({
  id_servizio_a_terra: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number(),
});
export const PagamentoVoliSchema = z.object({
  id_volo: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number(),
});
export const PagamentoAssicurazioneSchema = z.object({
  id_fornitore: z.string(),
  id_assicurazione: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.number(),
});
export const PraticaSchema = z.object({
  id_cliente: z.string(),
  id_preventivo: z.string(),
  data_conferma: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_rientro: z.string().nullable().optional(),
  note: z.string().optional(),
  numero_passeggeri: z.number(),
});
export const FornitoreSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
  valuta: z.enum(valuteArray as [string, ...string[]]).nullable().optional(),
});
export const BancaSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
});
