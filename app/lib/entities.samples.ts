import { Pratica, PagamentoAssicurazione, PagamentoVolo, PagamentoServizioATerra, IncassoPartecipante, Partecipante, PreventivoMostrareCliente, Assicurazione, Volo, ServizioATerra, Preventivo, Fornitore, Cliente, Destinazione, Banca } from "./definitions";

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
  export const samplePagamentoAssicurazione: PagamentoAssicurazione = {
    id: '1',
    id_fornitore: '1',
    id_assicurazione: '1',
    id_banca: '2',
    importo: 50,
    data_scadenza: new Date('2023-12-01'),
    data_incasso: new Date('2023-12-05'),
  };
  export const samplePagamentoVolo: PagamentoVolo = {
    id: '1',
    id_fornitore: '1',
    id_volo: '1',
    id_banca: '3',
    importo: 300,
    data_scadenza: new Date('2023-12-01'),
    data_incasso: new Date('2023-12-05'),
  };
  export const samplePagamentoServizioATerra: PagamentoServizioATerra = {
    id: '1',
    id_fornitore: '1',
    id_servizio_a_terra: '1',
    id_banca: '2',
    importo: 500,
    data_scadenza: new Date('2023-12-01'),
    data_incasso: new Date('2023-12-05'),
  };
  export const sampleIncassoPartecipante: IncassoPartecipante = {
    id: '1',
    id_partecipante: '1',
    id_banca: '1',
    importo: 200,
    data_scadenza: new Date('2023-12-01'),
    data_incasso: new Date('2023-12-05'),
  };
  export const samplePartecipante: Partecipante = {
    id: '1',
    id_preventivo: '1',
    nome: 'Jane',
    cognome: 'Doe',
    tot_quota: 200,
  };
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
  export const sampleAssicurazione: Assicurazione = {
    id: '1',
    id_preventivo: '1',
    id_fornitore: '1',
    assicurazione: 'Travel Insurance',
    netto: 50,
    ricarico: 5,
  };
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
  export const sampleFornitore: Fornitore = {
    id: '1',
    nome: 'Supplier A',
    valuta: 'USD',
  };
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
  export const sampleDestinazione: Destinazione = {
    id: '1',
    nome: 'ALASKA',
  }
  export const sampleBanca: Banca = {
    id: '1',
    nome: 'INTESA SAN PAOLO',
  }