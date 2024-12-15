'use client';
import { lusitana } from "@/app/ui/fonts";
import InputTell from "@/app/ui/inputs/input-tell";
import InputText from "@/app/ui/inputs/input-text";
import InputSelect from "@/app/ui/inputs/input-select";
import InputNumber from "@/app/ui/inputs/input-number";
import InputEmail from "@/app/ui/inputs/input-email";
import InputDate from "@/app/ui/inputs/input-date";
import { useEffect, useState } from "react";
import fornitoriData from '@/app/seed/fornitori.json';
import destinazioniData from '@/app/seed/destinazioni.json';


// servizi a terra interface for storing input group values
class ServizioATerraInputGroup {
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
        public ricarico?: number,
        public servizio_aggiuntivi?: boolean,
        public tot?: number,
    ) { }
}
// voli interface for storing input group values
class VoloInputGroup {
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
        public ricarico?: number,
        public tot?: number,
    ) { }
}
// assicurazioni interface for storing input group values
class AssicurazioneInputGroup {
    constructor(
        public groupId: number,
        public fornitore?: string,
        public assicurazione?: string,
        public netto?: number,
        public ricarico?: number,
        public tot?: number
    ) { }
}

export default function GeneralInterfaceCreatePage() {
    // Extract the 'fornitori' and 'destinazioni' arrays from json
    // define the options for the input-selects
    const fornitoriValues = fornitoriData.fornitori;
    const destinazioniValues = destinazioniData.destinazioni;
    const provenienzaOptions = [
        'Passaparola',
        'Sito IWS',
        'Sito INO',
        'Telefono',
        'Email Diretta',
        'Sito ISE'
    ]
    const statoPreventivoOptions = [
        'da fare',
        'in trattativa',
        'confermato',
        'inviato'
    ]

    // percentuale ricarico
    const [percentualeRicarico, setPercentualeRicarico] = useState<number>(1);

    // gestione aggiunta/rimozione servizi a terra
    const [serviziATerra, setServiziATerra] = useState<ServizioATerraInputGroup[]>([
        new ServizioATerraInputGroup(1)
    ]);
    const aggiungiServizioATerra = () => {
        const newId = Math.max(...serviziATerra.map(s => s.groupId)) + 5
        setServiziATerra([...serviziATerra, new ServizioATerraInputGroup(newId)]);

    }
    const rimuoviServizioATerra = (groupId: number) => {
        setServiziATerra(serviziATerra.filter(servizio => servizio.groupId !== groupId));
    }
    const onVCServizioATerra = (e: any, id: number, name: string) => {
        console.log('change in a value of a servizioATerra <event, id, name>: ', e, id, name);
        setServiziATerra(serviziATerra.map(servizio => {
            if (servizio.groupId === id) {
                servizio[name] = e.target.value;
                if (!!percentualeRicarico && !!servizio.cambio && !!servizio.totale) {
                    servizio.ricarico = getRicarico(servizio.totale, servizio.cambio, percentualeRicarico);
                    servizio.tot = getTot(servizio.totale, servizio.cambio, servizio.ricarico);
                }
            }
            return servizio;
        }));
    }


    // gestione aggiunta/rimozione servizi aggiuntivi
    const [serviziAggiuntivi, setServiziAggiuntivi] = useState<ServizioATerraInputGroup[]>([
        new ServizioATerraInputGroup(1)
    ]);
    const aggiungiServizioAggiuntivo = () => {
        const newId = Math.max(...serviziAggiuntivi.map(s => s.groupId)) + 5
        setServiziAggiuntivi([...serviziAggiuntivi, new ServizioATerraInputGroup(newId)]);

    }
    const rimuoviServizioAggiuntivo = (groupId: number) => {
        setServiziAggiuntivi(serviziAggiuntivi.filter(servizio => servizio.groupId !== groupId));
    }
    const onVCServizioAggiuntivo = (e: any, id: number, name: string) => {
        console.log('change in a value of a servizioAggiuntivo <event, id, name>: ', e, id, name);
        setServiziAggiuntivi(serviziAggiuntivi.map(servizio => {
            if (servizio.groupId === id) {
                servizio[name] = e.target.value;
            }
            if (!!percentualeRicarico && !!servizio.cambio && !!servizio.totale) {
                servizio.ricarico = getRicarico(servizio.totale, servizio.cambio, percentualeRicarico);
                servizio.tot = getTot(servizio.totale, servizio.cambio, servizio.ricarico);
            }
            return servizio;
        }));
    }


    // gestione aggiunta/rimozione voli
    const [voli, setVoli] = useState<VoloInputGroup[]>([
        new VoloInputGroup(1)
    ]);
    const aggiungiVolo = () => {
        const newId = Math.max(...voli.map(s => s.groupId)) + 5
        setVoli([...voli, new VoloInputGroup(newId)]);

    }
    const rimuoviVolo = (groupId: number) => {
        setVoli(voli.filter(servizio => servizio.groupId !== groupId));
    }
    const onVCVolo = (e: any, id: number, name: string) => {
        console.log('change in a value of a volo <event, id, name>: ', e, id, name);
        setVoli(voli.map(volo => {
            if (volo.groupId === id) {
                volo[name] = e.target.value;
            }
            if (!!percentualeRicarico && !!volo.cambio && !!volo.totale) {
                volo.ricarico = getRicarico(volo.totale, volo.cambio, percentualeRicarico);
                volo.tot = getTot(volo.totale, volo.cambio, volo.ricarico);
            }
            return volo;
        }));
    }

    // gestione aggiunta/rimozione assicurazioni
    const [assicurazioni, setAssicurazioni] = useState<AssicurazioneInputGroup[]>([
        new AssicurazioneInputGroup(1)
    ]);
    const aggiungiAssicurazione = () => {
        const newId = Math.max(...assicurazioni.map(s => s.groupId)) + 5
        setAssicurazioni([...assicurazioni, new AssicurazioneInputGroup(newId)]);
    }
    const rimuoviAssicurazione = (groupId: number) => {
        setAssicurazioni(assicurazioni.filter(assicurazione => assicurazione.groupId !== groupId));
    }
    const onVCAssicurazione = (e: any, id: number, name: string) => {
        console.log('change in a value of a assicurazione <event, id, name>: ', e, id, name);
        setAssicurazioni(assicurazioni.map(assicurazione => {
            if (assicurazione.groupId === id) {
                assicurazione[name] = e.target.value;
            }
            if (!!percentualeRicarico && !!assicurazione.netto) { // cambio di una assicurazione è sempre 1
                assicurazione.ricarico = getRicarico(assicurazione.netto, 1, percentualeRicarico);
                assicurazione.tot = getTot(assicurazione.netto, 1, assicurazione.ricarico);
            }
            return assicurazione;
        }));
    }

    // logging changes in the states
    useEffect(() => {
        console.log('the serviziATerra state is: ', serviziATerra);
    }, [serviziATerra]);
    useEffect(() => {
        console.log('the serviziAggiuntivi state is: ', serviziAggiuntivi);
    }, [serviziAggiuntivi]);
    useEffect(() => {
        console.log('the voli state is: ', voli);
    }, [voli]);
    useEffect(() => {
        console.log('the assicurazioni state is: ', assicurazioni);
    }, [assicurazioni]);

    return (
        <>
            <h1 className={`mb-4 text-xl md:text-2xl`}>CREA PREVENTIVO</h1>
            {/* Cliente */}
            <h3 className="text-xl md:text-2xl pt-4 pb-1">Cliente</h3>
            <div className="flex flex-row">
                <InputText label="Nome" name="nome" />
                <InputText label="Cognome" name="cognome" />
                <InputText label="Note" name="note" />
                <InputText label="Città" name="citta" />
                <InputText label="Collegato" name="collegato" />
                <InputSelect label="Tipo" name="tipo" options={['PRIVATO', 'AGENZIA VIAGGI', 'AZIENDA']} />
                <InputDate label="Data di nascita" name="data_di_nascita" />
                <InputTell label="Telefono" name="telefono" />
                <InputEmail label="Email" name="email" />
                <InputSelect label="Provenienza" name="provenienza" options={provenienzaOptions} />
            </div>
            {/* Preventivo Cliente */}
            <h3 className="text-xl md:text-2xl pt-4 pb-1">Preventivo Cliente</h3>
            <InputNumber label="N. Preventivo" name="numero_preventivo" />
            <div className="flex flex-row">
                <InputEmail label="Email" name="email" />
                <InputText label="Riferimento" name="riferimento" />
                <InputText label="Operatore" name="operatore" />
                <InputText label="Feedback" name="feedback" />
                <InputText label="Note" name="note" />
                <InputTell label="Telefono" name="numero_di_telefono" />
                <InputNumber label="Adulti" name="adulti" />
                <InputNumber label="Bambini" name="bambini" />
                <InputDate label="Data di partenza" name="data_partenza" />
                <InputDate label="Data" name="data" />
                <InputSelect label="Stato" name="tipo_preventivo" options={statoPreventivoOptions} />  {/* TODO: quando sì rendere bordo verde */}
            </div>

            {/* Percentuale Ricarico */}
            <div className="flex flex-row">
                <InputNumber label="Percentuale ricarico" name="percentuale_ricarico" value={percentualeRicarico.toString()} onChange={(e) => setPercentualeRicarico(Number(e.target.value))} />
            </div>
            {/* Servizi a terra */}
            <div id="servizi-a-terra">
                <div className="flex flex-row items-center justify-start">
                    <div>
                        <h3 className="text-xl md:text-2xl pt-4 pb-1" > Servizi a terra</h3 >
                    </div>
                    <div className="flex flex-row items-center justify-center pt-4 pl-5">
                        <button
                            className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                            onClick={aggiungiServizioATerra}
                        >
                            +
                        </button>
                    </div >
                </div>
                <div className="input-group-list">
                    {
                        serviziATerra.map((servizio, index) => (
                            <div key={servizio.groupId}>
                                <div className="flex flex-row">
                                    <InputSelect onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'destinazione')} value={servizio?.destinazione} label="Destinazione" name="destinazione" options={destinazioniValues} />
                                    <InputSelect onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'fornitore')} value={servizio?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                    <InputText onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'descrizione')} value={servizio?.descrizione} label="Descrizione" name="descrizione" />
                                    <InputSelect onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'valuta')} value={servizio?.valuta} label="Valuta" name="valuta" options={['USD', 'EUR']} />
                                    <InputDate onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'data')} value={servizio?.data?.toString()} label="Data" name="data" />
                                    <InputNumber onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'numero_notti')} value={servizio?.numero_notti?.toString()} label="N. Notti" name="numero_notti" />
                                    <InputNumber onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'totale')} value={servizio?.totale?.toString()} label="Totale" name="totale" />
                                    <InputNumber onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'cambio')} value={servizio?.cambio?.toString()} label="Cambio" name="cambio" />
                                    <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                        <div className="pr-3">
                                            <p>tot euro: {servizio?.tot?.toString() ?? '0'}</p>
                                        </div>
                                        <div className="pr-3">
                                            <p>ricarico: {servizio?.ricarico?.toString() ?? '0'}</p>
                                        </div>
                                        <div>
                                            <button
                                                className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                                                onClick={() => rimuoviServizioATerra(servizio.groupId)}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="tot-euro-of-list flex flex-row items-center justify-start pt-4">
                    <p>somma tot euro: {serviziATerra.reduce((acc, servizio) => acc + (servizio.tot ?? 0), 0)}</p>
                </div>
            </div>



            {/* Servizi Aggiuntivi */}
            <div id="servizi-aggiuntivi">
                <div className="flex flex-row items-center justify-start">
                    <div>
                        <h3 className="text-xl md:text-2xl pt-4 pb-1" > Servizi aggiuntivi</h3 >
                    </div>
                    <div className="flex flex-row items-center justify-center pt-4 pl-5">
                        <button
                            className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                            onClick={aggiungiServizioAggiuntivo}
                        >
                            +
                        </button>
                    </div >
                </div>
                <div className="input-group-list">
                    {
                        serviziAggiuntivi.map((servizio, index) => (
                            <div key={servizio.groupId}>
                                <div className="flex flex-row">
                                    <InputSelect onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'destinazione')} value={servizio?.destinazione} label="Destinazione" name="destinazione" options={destinazioniValues} />
                                    <InputSelect onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'fornitore')} value={servizio?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                    <InputText onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'descrizione')} value={servizio?.descrizione} label="Descrizione" name="descrizione" />
                                    <InputDate onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'data')} value={servizio?.data?.toString()} label="Data" name="data" />
                                    <InputNumber onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'numero_notti')} value={servizio?.numero_notti?.toString()} label="N. Notti" name="numero_notti" />
                                    <InputSelect onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'valuta')} value={servizio?.valuta} label="Valuta" name="valuta" options={['USD', 'EUR']} />
                                    <InputNumber onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'totale')} value={servizio?.totale?.toString()} label="Totale" name="totale" />
                                    <InputNumber onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'cambio')} value={servizio?.cambio?.toString()} label="Cambio" name="cambio" />
                                    <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                        <div className="pr-3">
                                            <p>tot euro: {servizio?.tot?.toString() ?? '0'}</p>
                                        </div>
                                        <div className="pr-3">
                                            <p>ricarico: {servizio?.ricarico?.toString() ?? '0'}</p>
                                        </div>
                                        <div>
                                            <button
                                                className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                                                onClick={() => rimuoviServizioAggiuntivo(servizio.groupId)}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="tot-euro-of-list flex flex-row items-center justify-start pt-4">
                    <p>somma tot euro: {serviziAggiuntivi.reduce((acc, servizio) => acc + (servizio.tot ?? 0), 0)}</p>
                </div>
            </div>
            {/* Voli */}
            <div id="voli">
                <div className="flex flex-row items-center justify-start">
                    <div>
                        <h3 className="text-xl md:text-2xl pt-4 pb-1" > Voli</h3 >
                    </div>
                    <div className="flex flex-row items-center justify-center pt-4 pl-5">
                        <button
                            className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                            onClick={aggiungiVolo}
                        >
                            +
                        </button>
                    </div >
                </div>
                <div className="input-group-list">
                    {
                        voli.map((volo, index) => (
                            <div key={volo.groupId}>
                                <div className="flex flex-row">
                                    <InputSelect onChange={(e) => onVCVolo(e, volo.groupId, 'fornitore')} value={volo?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                    <InputText onChange={(e) => onVCVolo(e, volo.groupId, 'compagnia')} value={volo?.compagnia} label="Compagnia" name="compagnia" />
                                    <InputText onChange={(e) => onVCVolo(e, volo.groupId, 'descrizione')} value={volo?.descrizione} label="Descrizione" name="descrizione" />
                                    <InputDate onChange={(e) => onVCVolo(e, volo.groupId, 'data_partenza')} value={volo?.data_partenza?.toString()} label="Partenza" name="data_partenza" />
                                    <InputDate onChange={(e) => onVCVolo(e, volo.groupId, 'data_arrivo')} value={volo?.data_arrivo?.toString()} label="Arrivo" name="data_arrivo" />
                                    <InputNumber onChange={(e) => onVCVolo(e, volo.groupId, 'totale')} value={volo?.totale?.toString()} label="Totale" name="totale" />
                                    <InputSelect onChange={(e) => onVCVolo(e, volo.groupId, 'valuta')} value={volo?.valuta} label="Valuta" name="valuta" options={['USD', 'EUR']} />
                                    <InputNumber onChange={(e) => onVCVolo(e, volo.groupId, 'cambio')} value={volo?.cambio?.toString()} label="Cambio" name="cambio" />
                                    <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                        <div className="pr-3">
                                            <p>tot euro: {volo?.tot?.toString() ?? '0'}</p>
                                        </div>
                                        <div className="pr-3">
                                            <p>ricarico: {volo?.ricarico?.toString() ?? '0'}</p>
                                        </div>
                                        <div>
                                            <button
                                                className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                                                onClick={() => rimuoviVolo(volo.groupId)}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="tot-euro-of-list flex flex-row items-center justify-start pt-4">
                    <p>somma tot euro: {voli.reduce((acc, volo) => acc + (volo.tot ?? 0), 0)}</p>
                </div>
            </div>

            {/* Assicurazioni */}
            <div id="assicurazioni">
                <div className="flex flex-row items-center justify-start">
                    <div>
                        <h3 className="text-xl md:text-2xl pt-4 pb-1" > Assicurazioni</h3 >
                    </div>
                    <div className="flex flex-row items-center justify-center pt-4 pl-5">
                        <button
                            className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                            onClick={aggiungiAssicurazione}
                        >
                            +
                        </button>
                    </div >
                </div>
                <div className="input-group-list">
                    {
                        assicurazioni.map((assicurazione, index) => (
                            <div key={assicurazione.groupId}>
                                <div className="flex flex-row">
                                    <InputSelect onChange={(e) => onVCAssicurazione(e, assicurazione.groupId, 'fornitore')} value={assicurazione?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                    <InputText onChange={(e) => onVCAssicurazione(e, assicurazione.groupId, 'assicurazione')} value={assicurazione?.assicurazione} label="Assicurazione" name="assicurazione" />
                                    <InputNumber onChange={(e) => onVCAssicurazione(e, assicurazione.groupId, 'netto')} value={assicurazione?.netto?.toString()} label="Netto" name="netto" />
                                    <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                        <div className="pr-3">
                                            <p>tot euro: {assicurazione?.tot?.toString() ?? '0'}</p>
                                        </div>
                                        <div className="pr-3">
                                            <p>ricarico: {assicurazione?.ricarico?.toString() ?? '0'}</p>
                                        </div>
                                        <div>
                                            <button
                                                className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full"
                                                onClick={() => rimuoviAssicurazione(assicurazione.groupId)}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="tot-euro-of-list flex flex-row items-center justify-start pt-4">
                    <p>somma tot euro: {assicurazioni.reduce((acc, assicurazione) => acc + (assicurazione.tot ?? 0), 0)}</p>
                </div>
            </div>

            {/* Totale */}
            <div className="tot-euro-of-list flex flex-row items-center justify-start pt-4">
                <p>somma di tutti i tot euro: {
                    serviziATerra.reduce((acc, servizio) => acc + (servizio.tot ?? 0), 0) +
                    serviziAggiuntivi.reduce((acc, servizio) => acc + (servizio.tot ?? 0), 0) +
                    voli.reduce((acc, volo) => acc + (volo.tot ?? 0), 0) +
                    assicurazioni.reduce((acc, assicurazione) => acc + (assicurazione.tot ?? 0), 0)
                }</p>
            </div>
        </>
    );
}
/*
 */

// helper functions to compute totale and ricarico
const getTot = (totale: number, cambio: number, ricarico: number) => {
    console.log('getTot');
    console.log('totale: ', totale);
    console.log('cambio: ', cambio);
    console.log('ricarico: ', ricarico);
    const result = (totale / cambio) + ricarico;
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}
const getRicarico = (totale: number, cambio: number, percentualeRicarico: number) => {
    console.log('getRicarico');
    console.log('totale: ', totale);
    console.log('cambio: ', cambio);
    console.log('percentualeRicarico: ', percentualeRicarico);
    const result = (totale / cambio) * percentualeRicarico;
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}
