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
  note: z.string().nullable().optional(),
  riferimento: z.string().nullable().optional(),
  operatore: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  adulti: z.string().nullable().optional(),
  bambini: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_preventivo: z.string().optional(),
  stato: z.string().nullable().optional(),
});
export const UpdatePreventivoSchema = z.object({
  note: z.string().nullable().optional(),
  riferimento: z.string().nullable().optional(),
  operatore: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  adulti: z.string().nullable().optional(),
  bambini: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  stato: z.string().nullable().optional(),
  numero_preventivo: z.string().nullable().optional(),
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
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_notti: z.string().nullable().optional(),
  totale: z.string().nullable().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).optional(),
  cambio: z.string().nullable().optional(),
  servizio_aggiuntivo: z.boolean(),
});
export const UpdateServizioATerraSchema = z.object({
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  numero_notti: z.string().nullable().optional(),
  totale: z.string().nullable().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).optional(),
  cambio: z.string().nullable().optional(),
  servizio_aggiuntivo: z.boolean(),
});
export const VoloSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string(),
  compagnia_aerea: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_arrivo: z.string().nullable().optional(),
  totale: z.string().nullable().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).optional(),
  cambio: z.string().nullable().optional(),
});
export const UpdateVoloSchema = z.object({
  compagnia_aerea: z.string().nullable().optional(),
  descrizione: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_arrivo: z.string().nullable().optional(),
  totale: z.string().nullable().optional(),
  valuta: z.enum(valuteArray as [string, ...string[]]).optional(),
  cambio: z.string().nullable().optional(),
});
export const AssicurazioneSchema = z.object({
  id_preventivo: z.string(),
  id_fornitore: z.string(),
  assicurazione: z.string(),
  netto: z.string().nullable().optional(),
});
export const UpdateAssicurazioneSchema = z.object({
  assicurazione: z.string(),
  netto: z.string().nullable().optional(),
});
export const PreventivoMostrareClienteSchema = z.object({
  id_destinazione: z.string(),
  id_preventivo: z.string(),
  descrizione: z.string().nullable().optional(),
  tipo: z.enum(["destinazione", "volo", "assicurazione"]),
  costo_individuale: z.string().nullable().optional(),
  importo_vendita: z.string().nullable().optional(),
  totale: z.string().nullable().optional(),
});
export const PartecipanteSchema = z.object({
  id_preventivo: z.string(),
  nome: z.string().optional(),
  cognome: z.string().optional(),
  tot_quota: z.string().nullable().optional(),
});
export const IncassoPartecipanteSchema = z.object({
  id_partecipante: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.string().nullable().optional(),
});
export const PagamentoServiziATerraSchema = z.object({
  id_servizio_a_terra: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.string().nullable().optional(),
});
export const PagamentoVoliSchema = z.object({
  id_volo: z.string(),
  id_fornitore: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.string().nullable().optional(),
});
export const PagamentoAssicurazioneSchema = z.object({
  id_fornitore: z.string(),
  id_assicurazione: z.string(),
  id_banca: z.string(),
  data_scadenza: z.string().nullable().optional(),
  data_incasso: z.string().nullable().optional(),
  importo: z.string().nullable().optional(),
});
export const PraticaSchema = z.object({
  id_cliente: z.string(),
  id_preventivo: z.string(),
  data_conferma: z.string().nullable().optional(),
  data_partenza: z.string().nullable().optional(),
  data_rientro: z.string().nullable().optional(),
  note: z.string().optional(),
  numero_passeggeri: z.string().nullable().optional(),
});
