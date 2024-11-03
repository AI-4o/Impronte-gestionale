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

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

// TODO: refactor so that it is just 'Invoices'
export type InvoicesTableRow = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};


// #### SAFARI DEFINITIONS ####
export interface Entity {
  id: string;
}
export interface EntityList<T> {
  entityName: string;
  data: T[];
}
export interface FetchableEntity<T> {
  name: string;
  fetchCallback: () => Promise<EntityList<T>>;
  sampleModel: T;
}
export interface Destinazione extends Entity {
  id: string;
  nome: string;
}
export interface Banca extends Entity {
  nome: string;
}
export interface Cliente extends Entity {
  nome: string;
  cognome: string;
  tel?: string;
  email?: string;
  tipo?: 'PRIVATO' | 'AGENZIA VIAGGI' | 'AZIENDA';
  provenienza?:
    | 'Passaparola'
    | 'Sito IWS'
    | 'Sito INO'
    | 'Telefono'
    | 'Email Diretta'
    | 'Sito ISE';
  collegato?: string;
  citta?: string;
  note?: string;
  data_di_nascita?: Date;
}
export interface Fornitore extends Entity {
  id: string;
  nome: string;
  valuta?: string;
}
export interface Preventivo extends Entity{
  id: string;
  id_cliente: string;
  email: string;
  numero_di_telefono?: string;
  id_fornitore?: string;
  note?: string;
  adulti?: number;
  bambini?: number;
  riferimento?: string;
  data_partenza?: Date;
  operatore?: string;
  feedback?: string;
  stato?: 'da fare' | 'in trattativa' | 'confermato' | 'inviato';
  data?: Date;
  numero_preventivo?: string;
  confermato?: boolean;
}
export interface ServizioATerra extends Entity{
  id: string;
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
  id: string;
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
  id: string;
  id_preventivo: string;
  id_fornitore: string;
  assicurazione?: string;
  netto?: number;
  ricarico?: number;
}
export interface PreventivoCliente extends Entity{
  id: string;
  id_preventivo: string;
  id_destinazione: string;
  descrizione?: string;
  tipo?: 'destinazione' | 'volo' | 'assicurazione';
  costo_individuale?: number;
  importo_vendita?: number;
  totale?: number;
}
export interface Partecipante extends Entity{
  id: string;
  id_preventivo: string;
  nome?: string;
  cognome?: string;
  tot_quota?: number;
}
export interface IncassoPartecipante extends Entity{
  id: string;
  id_partecipante: string;
  id_banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}
export interface PagamentoServizioATerra extends Entity{
  id: string;
  id_fornitore: string;
  id_servizio_a_terra: string;
  id_banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}
export interface PagamentoVolo extends Entity{
  id: string;
  id_fornitore: string;
  id_volo: string;
  id_banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}
export interface PagamentoAssicurazione extends Entity{
  id: string;
  id_fornitore: string;
  id_assicurazione: string;
  id_banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}
export interface Pratica extends Entity{
  id: string;
  id_preventivo: string;
  id_cliente: string;
  data_conferma?: Date;
  data_partenza?: Date;
  data_rientro?: Date;
  note?: string;
  numero_passeggeri?: number;
  totale?: number;
}