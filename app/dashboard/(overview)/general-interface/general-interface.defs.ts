import { Preventivo } from "@/app/lib/definitions";

// cliente interface
export class ClienteInputGroup {
  constructor(
    public nome?: string,
    public cognome?: string,
    public note?: string,
    public citta?: string,
    public collegato?: string,
    public tipo?: string,
    public data_di_nascita?: Date,
    public tel?: string,
    public email?: string,
    public provenienza?: string,
    public indirizzo?: string,
    public cap?: string,
    public cf?: string,
    public luogo_nascita?: string,
    public provincia_nascita?: string,
    public numero_passaporto?: string,
    public data_scadenza_passaporto?: Date,
    public nazionalita?: string,
    public provincia?: string,
    public sesso?: "M" | "F",
    public id?: string
  ) {
    this.id = id ?? undefined;
    this.nome = nome ?? undefined;
    this.cognome = cognome ?? undefined;
    this.note = note ?? undefined;
    this.citta = citta ?? undefined;
    this.collegato = collegato ?? undefined;
    this.tipo = tipo ?? undefined;
    this.data_di_nascita = data_di_nascita ?? undefined;
    this.tel = tel ?? undefined;
    this.email = email ?? undefined;
    this.provenienza = provenienza ?? undefined;
    this.indirizzo = indirizzo ?? undefined;
    this.cap = cap ?? undefined;
    this.cf = cf ?? undefined;
    this.luogo_nascita = luogo_nascita ?? undefined;
    this.provincia_nascita = provincia_nascita ?? undefined;
    this.numero_passaporto = numero_passaporto ?? undefined;
    this.data_scadenza_passaporto = data_scadenza_passaporto ?? undefined;
    this.nazionalita = nazionalita ?? undefined;
    this.provincia = provincia ?? undefined;
    this.sesso = sesso ?? undefined;
  }
}
// preventivo cliente interface
export class PreventivoInputGroup {
  numero_preventivo: string;
  percentuale_ricarico: number;
  brand: string;
  riferimento: string;
  operatore: string;
  feedback: string;
  note: string;
  adulti: number;
  bambini: number;
  data_partenza: Date;
  data: Date;
  stato: string;
  destinazione: string;
  tipo_viaggio: string;
  id: string;
  // Dichiarazione delle firme dei costruttori
  constructor(preventivo: Preventivo);
  constructor(
    numero_preventivo?: string,
    percentuale_ricarico?: number,
    brand?: string,
    riferimento?: string,
    operatore?: string,
    feedback?: string,
    note?: string,
    adulti?: number,
    bambini?: number,
    data_partenza?: Date,
    data?: Date,
    stato?: "da fare" | "in trattativa" | "confermato" | "inviato",
    destinazione?: string,
    tipo_viaggio?: "viaggio di nozze" | "viaggio di lavoro" | "altro",
    id?: string
  );
  // Implementazione del costruttore
  constructor(
    preventivoOrNumero?: Preventivo | string,
    percentuale_ricarico?: number,
    brand?: string,
    riferimento?: string,
    operatore?: string,
    feedback?: string,
    note?: string,
    adulti?: number,
    bambini?: number,
    data_partenza?: Date,
    data?: Date,
    stato?: "da fare" | "in trattativa" | "confermato" | "inviato",
    destinazione?: string,
    tipo_viaggio?: "viaggio di nozze" | "viaggio di lavoro" | "altro",
    id?: string
  ) {
    if (preventivoOrNumero instanceof Object ) {
      // Caso in cui viene passato un oggetto Preventivo
      const preventivo = preventivoOrNumero as Preventivo;
      this.numero_preventivo = preventivo.numero_preventivo ?? "0";
      this.percentuale_ricarico = preventivo.percentuale_ricarico ?? 0;
      this.brand = preventivo.brand ?? undefined;
      this.riferimento = preventivo.riferimento ?? undefined;
      this.operatore = preventivo.operatore ?? undefined;
      this.feedback = preventivo.feedback ?? undefined;
      this.note = preventivo.note ?? undefined;
      this.adulti = preventivo.adulti ?? 0;
      this.bambini = preventivo.bambini ?? 0;
      this.data_partenza = preventivo.data_partenza ?? undefined;
      this.data = preventivo.data ?? undefined;
      this.stato = preventivo.stato ?? undefined;
      this.destinazione = preventivo.destinazione ?? undefined;
      this.tipo_viaggio = preventivo.tipo_viaggio ?? undefined;
      this.id = preventivo.id ?? undefined;
    } else {
      // Caso in cui vengono passati i singoli parametri
      this.numero_preventivo = (preventivoOrNumero as string) ?? "0";
      this.percentuale_ricarico = percentuale_ricarico ?? 0;
      this.brand = brand ?? undefined;
      this.riferimento = riferimento ?? undefined;
      this.operatore = operatore ?? undefined;
      this.feedback = feedback ?? undefined;
      this.note = note ?? undefined;
      this.adulti = adulti ?? 0;
      this.bambini = bambini ?? 0;
      this.data_partenza = data_partenza ?? undefined;
      this.data = data ?? undefined;
      this.stato = stato ?? undefined;
      this.destinazione = destinazione ?? undefined;
      this.tipo_viaggio = tipo_viaggio ?? undefined;
      this.id = id ?? undefined;
    }
  }
}
// servizi a terra interface for storing input group values
export class ServizioATerraInputGroup {
  constructor(
    public groupId: number,
    public destinazione?: string,
    public fornitore?: string,
    public descrizione?: string,
    public data?: Date,
    public numero_notti?: number,
    public numero_camere?: number,
    public valuta?: string,
    public totale?: number,
    public cambio?: number,
    public servizio_aggiuntivo?: boolean,
    public id?: string
  ) {
    this.id = id ?? undefined;
    this.destinazione = destinazione ?? undefined;
    this.fornitore = fornitore ?? undefined;
    this.descrizione = descrizione ?? undefined;
    this.data = data ?? undefined;
    this.numero_notti = numero_notti ?? 0;
    this.numero_camere = numero_camere ?? 0;
    this.valuta = valuta ?? undefined;
    this.totale = totale ?? 0;
    this.cambio = cambio ?? 1;
    this.servizio_aggiuntivo = servizio_aggiuntivo ?? undefined;
  }
}
// voli interface for storing input group values
export class VoloInputGroup {
  constructor(
    public groupId: number,
    public fornitore?: string,
    public compagnia_aerea?: string,
    public descrizione?: string,
    public data_partenza?: Date,
    public data_arrivo?: Date,
    public totale?: number,
    public ricarico?: number,
    public numero?: number,
    public valuta?: string,
    public cambio?: number,
    public id?: string
  ) {
    this.id = id ?? undefined;
    this.fornitore = fornitore ?? undefined;
    this.compagnia_aerea = compagnia_aerea ?? undefined;
    this.descrizione = descrizione ?? undefined;
    this.data_partenza = data_partenza ?? undefined;
    this.data_arrivo = data_arrivo ?? undefined;
    this.totale = totale ?? 0;
    this.ricarico = ricarico ?? 0;
    this.numero = numero ?? 0;
    this.valuta = valuta ?? undefined;
    this.cambio = cambio ?? 1;
  }
}
// assicurazioni interface for storing input group values
export class AssicurazioneInputGroup {
  constructor(
    public groupId: number,
    public fornitore?: string,
    public assicurazione?: string,
    public netto?: number,
    public ricarico?: number,
    public numero?: number,
    public id?: string
  ) {
    this.id = id ?? undefined;
    this.fornitore = fornitore ?? undefined;
    this.assicurazione = assicurazione ?? undefined;
    this.netto = netto ?? 0;
    this.ricarico = ricarico ?? 0;
    this.numero = numero ?? 0;
  }
}

// preventivo mostrare cliente interface
export class PreventivoAlClienteRow {
  constructor(
    public groupId: number,
    public destinazione?: string,
    public descrizione?: string,
    public individuale?: number,
    public numero?: number,
    public id?: string
  ) {
    this.id = id ?? undefined;
    this.destinazione = destinazione ?? undefined;
    this.descrizione = descrizione ?? undefined;
    this.individuale = individuale ?? 0;
    this.numero = numero ?? 0;
  }
}
export class PreventivoAlClienteInputGroup {
  constructor(
    public descrizione_viaggio?: string,
    public righePrimoTipo?: PreventivoAlClienteRow[],
    public righeSecondoTipo?: PreventivoAlClienteRow[],
    public id?: string
  ) {
    this.id = id ?? undefined;
    this.descrizione_viaggio = descrizione_viaggio ?? undefined;
    this.righePrimoTipo = righePrimoTipo ?? undefined;
    this.righeSecondoTipo = righeSecondoTipo ?? undefined;
  }
}
export interface Data {
  cliente?: ClienteInputGroup;
  preventivo?: PreventivoInputGroup;
  serviziATerra?: ServizioATerraInputGroup[];
  serviziAggiuntivi?: ServizioATerraInputGroup[];
  voli?: VoloInputGroup[];
  assicurazioni?: AssicurazioneInputGroup[];
  preventivoAlCliente?: PreventivoAlClienteInputGroup;
}
export const SUCCESSMESSAGE = "Operazione effettuata con successo 🥳";
export const ERRORMESSAGE = "Operazione fallita 😢";
