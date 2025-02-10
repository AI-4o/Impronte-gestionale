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
        public id?: string,
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
    }
}
// preventivo cliente interface
export class PreventivoInputGroup {
    constructor(
        public numero_preventivo?: string,
        public percentuale_ricarico?: number,
        public brand?: string,
        public riferimento?: string,
        public operatore?: string,
        public feedback?: string,
        public note?: string,
        public adulti?: number,
        public bambini?: number,
        public data_partenza?: Date,
        public data?: Date,
        public stato?: 'da fare' | 'in trattativa' | 'confermato' | 'inviato',
        public id?: string,
    ) { 
        this.numero_preventivo = numero_preventivo ?? '0';
        this.percentuale_ricarico = percentuale_ricarico ?? 0;
        this.brand = brand ?? undefined;
        this.riferimento = riferimento ?? undefined;
        this.operatore = operatore ?? undefined;
        this.feedback = feedback ?? undefined;
        this.note = note ?? undefined;
        this.adulti = adulti ?? undefined;
        this.bambini = bambini ?? undefined;
        this.data_partenza = data_partenza ?? undefined;
        this.data = data ?? undefined;
        this.stato = stato ?? undefined;
        this.id = id ?? undefined;
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
        public id?: string,
    ) { 
        this.id = id ?? undefined;
        this.destinazione = destinazione ?? undefined;
        this.fornitore = fornitore ?? undefined;
        this.descrizione = descrizione ?? undefined;
        this.data = data ?? undefined;
        this.numero_notti = numero_notti ?? undefined;
        this.numero_camere = numero_camere ?? undefined;
        this.valuta = valuta ?? undefined;
        this.totale = totale ?? undefined;
        this.cambio = cambio ?? undefined;
        this.servizio_aggiuntivo = servizio_aggiuntivo ?? undefined;
    }
}
// voli interface for storing input group values
export class VoloInputGroup {
    constructor(
        public groupId: number,
        public fornitore?: string,
        public compagnia?: string,
        public descrizione?: string,
        public data_partenza?: Date,
        public data_arrivo?: Date,
        public totale?: number,
        public ricarico?: number,
        public numero?: number,
        public valuta?: string,
        public cambio?: number,
        public id?: string,
    ) { 
        this.id = id ?? undefined;
        this.fornitore = fornitore ?? undefined;
        this.compagnia = compagnia ?? undefined;
        this.descrizione = descrizione ?? undefined;
        this.data_partenza = data_partenza ?? undefined;
        this.data_arrivo = data_arrivo ?? undefined;
        this.totale = totale ?? undefined;
        this.ricarico = ricarico ?? undefined;
        this.numero = numero ?? undefined;
        this.valuta = valuta ?? undefined;
        this.cambio = cambio ?? undefined;
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
        this.netto = netto ?? undefined;
        this.ricarico = ricarico ?? undefined;
        this.numero = numero ?? undefined;
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
        public id?: string,
    ) { 
        this.id = id ?? undefined;
        this.destinazione = destinazione ?? undefined;
        this.descrizione = descrizione ?? undefined;
        this.individuale = individuale ?? undefined;
        this.numero = numero ?? undefined;
    }
}
export class PreventivoAlClienteInputGroup {
    constructor(
        public descrizione_viaggio?: string,
        public righePrimoTipo?: PreventivoAlClienteRow[],
        public righeSecondoTipo?: PreventivoAlClienteRow[],
        public id?: string,
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
export const SUCCESSMESSAGE =  "Operazione effettuata con successo 🥳"
export const ERRORMESSAGE = "Operazione fallita 😢"