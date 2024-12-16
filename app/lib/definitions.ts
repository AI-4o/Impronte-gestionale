// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// #### ENTITIES DEFINITIONS ####
export interface Entity {
  id: string;
}
/**
 * Interface with fields:
 * 1. entityName -> name of the type T of entity
 * 2. data -> array of entities of type T
 */
export interface TEntityList<T> {
  entityName: string;
  data: T[];
}
/**
 * Interface 
 */
export interface FetchableEntity<T> {
  name: string;
  fetchCallback: () => Promise<TEntityList<T>>;
}
export interface Destinazione extends Entity {
  id: string;
  nome: string;
}
export interface Banca extends Entity {
  nome: string;
}
export interface Cliente extends Entity {
  nome?: string;
  cognome?: string;
  tel?: string;
  email?: string;
  tipo?: string;
  provenienza?:string;
  collegato?: string;
  citta?: string;
  note?: string;
  data_di_nascita?: Date;
}

export interface Fornitore extends Entity {
  nome: string;
  valuta?: string;
}
export interface Preventivo extends Entity{
  id_cliente: string;
  email: string;
  numero_di_telefono?: string;
  id_fornitore?: string;
  note?: string;
  adulti?: number;
  bambini?: number;
  riferimento?: string;
  data_partenza?: Date;
  brand?: string;
  operatore?: string;
  feedback?: string;
  stato?: string;
  data?: Date;
  numero_preventivo?: string;
  confermato?: boolean;
}
export interface ServizioATerra extends Entity{
  id_preventivo: string;
  id_fornitore: string;
  id_destinazione: string;
  descrizione?: string;
  data?: Date;
  numero_notti?: number;
  totale?: number;
  valuta?: string;
  cambio?: number;
  ricarico?: number;
  servizio_aggiuntivi?: boolean;
}
export interface Volo extends Entity{
  id_preventivo: string;
  id_fornitore: string;
  compagnia_aerea?: string;
  descrizione?: string;
  data_partenza?: Date;
  data_arrivo?: Date;
  totale?: number;
  valuta?: string;
  cambio?: number;
  ricarico?: number;
}
export interface Assicurazione extends Entity{
  id_preventivo: string;
  id_fornitore: string;
  assicurazione?: string;
  netto?: number;
  ricarico?: number;
}
export interface PreventivoMostrareCliente extends Entity{
  id_preventivo: string;
  id_destinazione: string;
  descrizione?: string;
  tipo?: string;
  costo_individuale?: number;
  importo_vendita?: number;
  totale?: number;
}
export interface Partecipante extends Entity{
  id_preventivo: string;
  nome?: string;
  cognome?: string;
  tot_quota?: number;
}
export interface Transazione extends Entity{
  id_banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}
export interface IncassoPartecipante extends Transazione{
  id_partecipante: string;
}
export interface PagamentoServizioATerra extends Transazione{
  id_servizio_a_terra: string;
}
export interface PagamentoVolo extends Transazione{
  id_volo: string;
}
export interface PagamentoAssicurazione extends Transazione{
  id_assicurazione: string;
}
export interface Pratica extends Entity{
  id_preventivo: string;
  id_cliente: string;
  data_conferma?: Date;
  data_partenza?: Date;
  data_rientro?: Date;
  note?: string;
  numero_passeggeri?: number;
  totale?: number;
}