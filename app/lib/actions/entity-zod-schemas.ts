import { z } from "zod";

export const valuteArray = ["EUR", "USD"];
export const ClienteSchema = z.object({
  nome: z.string(),
  cognome: z.string().optional(),
  note: z.string().nullable().optional(),
  tipo: z.string().nullable().optional(),
  data_di_nascita: z.string().nullable().optional(),
  email: z.string().email().optional(),
  citta: z.string().nullable().optional(),
  collegato: z.string().nullable().optional(),
  tel: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: "telefono must be in international format",
  }).nullable().optional(), // add control
  provenienza: z.string().nullable().optional(),
});
export const DestinazioneSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
});
export const PreventivoSchema = z.object({
  id_cliente: z.string(),
  email: z.string().email(),
  numero_di_telefono: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: "telefono must be in international format",
  }),
  note: z.string(),
  riferimento: z.string(),
  operatore: z.string(),
  feedback: z.string(),
  adulti: z.number().int().nonnegative(),
  bambini: z.number().int().nonnegative(),
  data_partenza: z.string().nullable(),
  data: z.string().nullable(),
  numero_preventivo: z.string(),
  stato: z.string().nullable(),
});
export const FornitoreSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
  valuta: z.enum(valuteArray as [string, ...string[]]),
});
export const BancaSchema = z.object({
  nome: z.string().min(1, { message: "Nome is required" }),
});
export const ServizioATerraSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string(),
  id_destinazione: z.string(),
  descrizione: z.string(),
  data: z.string().nullable(),
  numero_notti: z.number().int().nonnegative(),
  totale: z.number().nonnegative(),
  valuta: z.enum(valuteArray as [string, ...string[]]),
  cambio: z.number().nonnegative(),
  servizio_aggiuntivo: z.boolean(),
});
export const VoloSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string(),
  compagnia_aerea: z.string(),
  descrizione: z.string(),
  data_partenza: z.string().nullable(),
  data_arrivo: z.string().nullable(),
  totale: z.number().nonnegative(),
  valuta: z.enum(valuteArray as [string, ...string[]]),
  cambio: z.number().nonnegative(),
});
export const AssicurazioneSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string(),
  assicurazione: z.string(),
  netto: z.number().nonnegative(),
});
export const PreventivoMostrareClienteSchema = z.object({
  id_destinazione: z.string(),
  id_preventivo: z.string(),
  descrizione: z.string(),
  tipo: z.enum(["destinazione", "volo", "assicurazione"]),
  costo_individuale: z.number().nonnegative(),
  importo_vendita: z.number().nonnegative(),
  totale: z.number().nonnegative(),
});
export const PartecipanteSchema = z.object({
  id_preventivo: z.string(),
  nome: z.string(),
  cognome: z.string(),
  tot_quota: z.number().nonnegative(),
});
export const IncassoPartecipanteSchema = z.object({
  id_partecipante: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().date(),
  data_incasso: z.string().date(),
  importo: z.number().nonnegative(),
});
export const PagamentoServiziATerraSchema = z.object({
  id_servizio_a_terra: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().date(),
  data_incasso: z.string().date(),
  importo: z.number().nonnegative(),
});
export const PagamentoVoliSchema = z.object({
  id_volo: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().date(),
  data_incasso: z.string().date(),
  importo: z.number().nonnegative(),
});
export const PagamentoAssicurazioneSchema = z.object({
  id_fornitore: z.string(),
  id_assicurazione: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().date(),
  data_incasso: z.string().date(),
  importo: z.number().nonnegative(),
});
export const PraticaSchema = z.object({
  id_cliente: z.string(),
  id_preventivo: z.string(),
  data_conferma: z.string().date(),
  data_partenza: z.string().date(),
  data_rientro: z.string().date(),
  note: z.string(),
  numero_passeggeri: z.number().int().nonnegative(),
  totale: z.number().nonnegative(),
});
