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
export interface Destinazione {
  id: string;
  nome: string;
}

export const sampleDestinazione: Destinazione = {
  id: '1',
  nome: 'Rome',
};

export interface Cliente {
  id: string;
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

export const sampleCliente: Cliente = {
  id: '1',
  nome: 'John',
  cognome: 'Doe',
  tel: '1234567890',
  email: 'john.doe@example.com',
  tipo: 'PRIVATO',
  provenienza: 'Passaparola',
  collegato: 'Jane Doe',
  citta: 'New York',
  note: 'Regular customer',
  data_di_nascita: new Date('1990-01-01'),
};

export interface Fornitore {
  id: string;
  nome: string;
  valuta?: string;
}

export const sampleFornitore: Fornitore = {
  id: '1',
  nome: 'Supplier A',
  valuta: 'USD',
};

export interface Preventivo {
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

export const samplePreventivo: Preventivo = {
  id: '1',
  id_cliente: '1',
  email: 'john.doe@example.com',
  numero_di_telefono: '1234567890',
  id_fornitore: '1',
  note: 'Urgent',
  adulti: 2,
  bambini: 1,
  riferimento: 'Ref123',
  data_partenza: new Date('2023-12-25'),
  operatore: 'Operator A',
  feedback: 'Positive',
  stato: 'confermato',
  data: new Date(),
  numero_preventivo: 'PREV123',
  confermato: true,
};

export interface ServizioATerra {
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

export const sampleServizioATerra: ServizioATerra = {
  id: '1',
  id_preventivo: '1',
  id_fornitore: '1',
  id_destinazione: '1',
  descrizione: 'Hotel stay',
  data: new Date('2023-12-25'),
  numero_notti: 5,
  totale: 500,
  valuta: 'USD',
  cambio: 1.1,
  ricarico: 10,
  servizio_aggiuntivi: true,
};

export interface Volo {
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

export const sampleVolo: Volo = {
  id: '1',
  id_preventivo: '1',
  id_fornitore: '1',
  compagnia_aerea: 'Airline A',
  descrizione: 'Flight to Rome',
  data_partenza: new Date('2023-12-25'),
  data_arrivo: new Date('2023-12-26'),
  totale: 300,
  valuta: 'USD',
  cambio: 1.1,
  ricarico: 15,
};

export interface Assicurazione {
  id: string;
  id_preventivo: string;
  id_fornitore: string;
  assicurazione?: string;
  netto?: number;
  ricarico?: number;
}

export const sampleAssicurazione: Assicurazione = {
  id: '1',
  id_preventivo: '1',
  id_fornitore: '1',
  assicurazione: 'Travel Insurance',
  netto: 50,
  ricarico: 5,
};

export interface PreventivoMostrareCliente {
  id: string;
  id_preventivo: string;
  id_destinazione: string;
  descrizione?: string;
  tipo?: 'destinazione' | 'volo' | 'assicurazione';
  costo_individuale?: number;
  importo_vendita?: number;
  totale?: number;
}

export const samplePreventivoMostrareCliente: PreventivoMostrareCliente = {
  id: '1',
  id_preventivo: '1',
  id_destinazione: '1',
  descrizione: 'Trip to Rome',
  tipo: 'destinazione',
  costo_individuale: 100,
  importo_vendita: 120,
  totale: 240,
};

export interface Partecipante {
  id: string;
  id_preventivo: string;
  nome?: string;
  cognome?: string;
  tot_quota?: number;
}

export const samplePartecipante: Partecipante = {
  id: '1',
  id_preventivo: '1',
  nome: 'Jane',
  cognome: 'Doe',
  tot_quota: 200,
};

export interface IncassoPartecipante {
  id: string;
  id_partecipante: string;
  banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}

export const sampleIncassoPartecipante: IncassoPartecipante = {
  id: '1',
  id_partecipante: '1',
  banca: 'Bank A',
  importo: 200,
  data_scadenza: new Date('2023-12-01'),
  data_incasso: new Date('2023-12-05'),
};

export interface PagamentoServizioATerra {
  id: string;
  id_fornitore: string;
  id_servizio_a_terra: string;
  banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}

export const samplePagamentoServizioATerra: PagamentoServizioATerra = {
  id: '1',
  id_fornitore: '1',
  id_servizio_a_terra: '1',
  banca: 'Bank B',
  importo: 500,
  data_scadenza: new Date('2023-12-01'),
  data_incasso: new Date('2023-12-05'),
};

export interface PagamentoVolo {
  id: string;
  id_fornitore: string;
  id_volo: string;
  banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}

export const samplePagamentoVolo: PagamentoVolo = {
  id: '1',
  id_fornitore: '1',
  id_volo: '1',
  banca: 'Bank C',
  importo: 300,
  data_scadenza: new Date('2023-12-01'),
  data_incasso: new Date('2023-12-05'),
};

export interface PagamentoAssicurazione {
  id: string;
  id_fornitore: string;
  id_assicurazione: string;
  banca?: string;
  importo?: number;
  data_scadenza?: Date;
  data_incasso?: Date;
}

export const samplePagamentoAssicurazione: PagamentoAssicurazione = {
  id: '1',
  id_fornitore: '1',
  id_assicurazione: '1',
  banca: 'Bank D',
  importo: 50,
  data_scadenza: new Date('2023-12-01'),
  data_incasso: new Date('2023-12-05'),
};

export interface Pratica {
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

export const samplePratica: Pratica = {
  id: '1',
  id_preventivo: '1',
  id_cliente: '1',
  data_conferma: new Date('2023-12-01'),
  data_partenza: new Date('2023-12-25'),
  data_rientro: new Date('2024-01-05'),
  note: 'Family trip',
  numero_passeggeri: 3,
  totale: 1000,
};