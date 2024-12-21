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
        public id?: string,
    ) { }
}

// preventivo cliente interface
export class PreventivoInputGroup {
    constructor(
        public numero_preventivo?: string,
        public brand?: string,
        public riferimento?: string,
        public operatore?: string,
        public feedback?: string,
        public note?: string,
        public adulti?: number,
        public bambini?: number,
        public data_partenza?: Date,
        public data?: Date,
        public stato?: string,
        public id?: string,
    ) { }
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
        public valuta?: string,
        public totale?: number,
        public cambio?: number,
        public servizio_aggiuntivo?: boolean,
        public id?: string,
    ) { }
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
        public valuta?: string,
        public cambio?: number,
        public id?: string,
    ) { }
}
// assicurazioni interface for storing input group values
export class AssicurazioneInputGroup {
    constructor(
        public groupId: number,
        public fornitore?: string,
        public assicurazione?: string,
        public netto?: number,
        public id?: string,
    ) { }
}
export interface Data {
    cliente?: ClienteInputGroup;
    preventivo?: PreventivoInputGroup;
    serviziATerra?: ServizioATerraInputGroup[];
    serviziAggiuntivi?: ServizioATerraInputGroup[];
    voli?: VoloInputGroup[];
    assicurazioni?: AssicurazioneInputGroup[];
}
export type Feedback = {
    message: React.ReactNode;
    type: 'success' | 'error';
    errorsMessage?: string;
}
export const SUCCESSMESSAGE =  "Operazione effettuata con successo 🥳"
export const ERRORMESSAGE = "Operazione fallita 😢"