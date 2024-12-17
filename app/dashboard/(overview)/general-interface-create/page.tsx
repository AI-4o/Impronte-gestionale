'use client';
import InputTell from "@/app/ui/inputs/input-tell";
import InputText from "@/app/ui/inputs/input-text";
import InputSelect from "@/app/ui/inputs/input-select";
import InputNumber from "@/app/ui/inputs/input-number";
import InputEmail from "@/app/ui/inputs/input-email";
import InputDate from "@/app/ui/inputs/input-date";
import { useEffect, useState } from "react";
import fornitoriData from '@/app/seed/fornitori.json';
import destinazioniData from '@/app/seed/destinazioni.json';
import { ClienteInputGroup, PreventivoInputGroup, ServizioATerraInputGroup, VoloInputGroup, AssicurazioneInputGroup, Data } from "./general-interface.defs";
import { formatDate } from "@/app/lib/utils";
import { createCliente, updateCliente } from "@/app/lib/actions/actions";


const initialData: Data = {
    cliente: new ClienteInputGroup(
        'Alfredo',
        'Ingraldo',
        'Ma quanto è figo'
    ),
    preventivo: new PreventivoInputGroup(
        '666',
        'IWS',
        'alfredo.ingraldo.u@gmail.com',
        'riferimento esempio',
        'operatore esempio',
        'feedback esempio',
        'note esempio',
        '+393333333333',
        2,
        0,
        new Date('2021-12-03'),
        new Date('2022-03-22'),
        'da fare'
    ),
    serviziATerra: [
        new ServizioATerraInputGroup(
            1,
            'ALASKA',
            'AAA JALALA',
            'descrizione esempio',
            new Date('2022-03-22'),
            1,
            'USD',
            100
        ),
        new ServizioATerraInputGroup(
            2,
            'ALASKA',
            'AAA JALALA',
            'descrizione esempio',
            new Date('2022-04-22'),
            1,
            'USD',
            100
        )
    ],
    serviziAggiuntivi: [new ServizioATerraInputGroup(
        1,
        'BALI',
        'AAA JALALA',
        'descrizione esempio servizio aggiuntivo',
        new Date('2025-01-01'),
        1,
        'USD',
        100,
        1,
        true
    )],
    voli: [
        new VoloInputGroup(
        1,
        'AAA JALALA',
        'compagnia esempio',
        'descrizione esempio',
        new Date('2025-01-01'),
        new Date('2025-01-01'),
        1,
        'USD',
        100
    ),
    new VoloInputGroup(
        2,
        'AAA JALALA',
        'compagnia esempio',
        'descrizione esempio',
        new Date('2025-01-01'),
        new Date('2025-01-01'),
        1,
        'USD',
        100
    )
],
    assicurazioni: [new AssicurazioneInputGroup(
        1,
        'AAA JALALA',
        'assicurazione esempio',
        666
    )],
}

export default function CreaPreventivoGeneralInterface() {
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
        'Sito ISE',
        'Sito IMS'
    ]
    const statoPreventivoOptions = [
        'da fare',
        'in trattativa',
        'confermato',
        'inviato'
    ]
    const brandPreventivoOptions = [
        'IWS',
        'INO',
        'ISE',
        'IMS',
        'BORN'
    ]

    // gestione lista clienti corrispondenti a ricerca
    const [clientiTrovati, setClientiTrovati] = useState<ClienteInputGroup[]>([]);
    const [showClientiTrovati, setShowClientiTrovati] = useState<boolean>(false);

    // geastione aggiorna cliente
    const [showFormAggiornaCliente, setShowFormAggiornaCliente] = useState<boolean>(false);
    const [clienteDaAggiornare, setClienteDaAggiornare] = useState<ClienteInputGroup>({});

    const onVCClienteDaAggiornare = (e: any, name: string) => {
        console.log('change in a value of a clienteDaAggiornare <event, id, name>: ', e, name);
        setClienteDaAggiornare((prevState) => {
            if (name === 'data_di_nascita') {
                return { ...prevState, data_di_nascita: new Date(e.target.value) };
            } else {
                return { ...prevState, [name]: e.target.value };
            }
        });
    }
    // gestione lista preventivi di un cliente
    const [preventiviClienteList, setPreventiviClienteList] = useState<PreventivoInputGroup[]>([]);
    const [showPreventiviClienteList, setShowPreventiviClienteList] = useState<boolean>(false);


    // gestione show form per creare preventivo
    const [showFormPreventivo, setShowFormPreventivo] = useState<boolean>(false);
    const [preventivoDaAggiornare, setPreventivoDaAggiornare] = useState<Data|{}>({});

    const getSommaTuttiTotEuro = () => {
        const totServiziATerra = serviziATerra.reduce((acc, servizio) => acc + getTot(servizio.totale, servizio.cambio ?? 1, getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico)), 0);
        const totServiziAggiuntivi = serviziAggiuntivi.reduce((acc, servizio) => acc + getTot(servizio.totale, servizio.cambio ?? 1, getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico)), 0);
        const totVoli = voli.reduce((acc, volo) => acc + getTot(volo.totale, volo.cambio ?? 1, getRicarico(volo.totale, volo.cambio ?? 1, percentualeRicarico)), 0);
        const totAssicurazioni = assicurazioni.reduce((acc, assicurazione) => acc + getTot(assicurazione.netto, 1, getRicarico(assicurazione.netto, 1, percentualeRicarico)), 0);
        return totServiziATerra + totServiziAggiuntivi + totVoli + totAssicurazioni;
    }

    /**
     * mostra form preventivo per il cliente, e aggiorna i valori in input del cliente con quelli del cliente passato
     * @param cliente 
     */
    const onClickShowFormNuovoPreventivo = (cliente: ClienteInputGroup) => {
        setShowFormPreventivo(true);
        setShowClientiTrovati(false);
        setCliente((prevState) => {
            return { ...prevState, ...cliente };
        });
    }

    // gestione cliente
    const [cliente, setCliente] = useState<ClienteInputGroup>(initialData.cliente ?? new ClienteInputGroup());
    const onVCCliente = async (e: any, name: string) => {
        console.log('change in a value of a cliente <event, id, name>: ', e, name);
        setShowFormPreventivo(false);
        setShowPreventiviClienteList(false);
        setShowClientiTrovati(true);
        setCliente((prevState) => {
            if (name === 'data_di_nascita') {
                return { ...prevState, data_di_nascita: new Date(e.target.value) };
            } else {
                return { ...prevState, [name]: e.target.value };
            }
        });
    }
    // gestione preventivo
    const [preventivo, setpreventivo] = useState<PreventivoInputGroup>(initialData.preventivo);
    const onVCpreventivo = (e: any, name: string) => {
        console.log('change in a value of a preventivo <event, id, name>: ', e, name);
        setpreventivo((prevState) => {
            if (name === 'data_partenza') {
                return { ...prevState, data_partenza: new Date(e.target.value) };
            } else if (name === 'data') {
                return { ...prevState, data: new Date(e.target.value) };
            } else {
                return { ...prevState, [name]: e.target.value };
            }
        });
    }
    // percentuale ricarico
    const [percentualeRicarico, setPercentualeRicarico] = useState<number>(1);

    // gestione aggiunta/rimozione servizi a terra
    const [serviziATerra, setServiziATerra] = useState<ServizioATerraInputGroup[]>([
        ...initialData.serviziATerra
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
                if (name === 'data') {
                    servizio.data = new Date(e.target.value);
                } else {
                    servizio[name] = e.target.value;
                }
            }
            return servizio;
        }));
    }

    // gestione aggiunta/rimozione servizi aggiuntivi
    const [serviziAggiuntivi, setServiziAggiuntivi] = useState<ServizioATerraInputGroup[]>([
        ...initialData.serviziAggiuntivi
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
                if (name === 'data') {
                    servizio.data = new Date(e.target.value);
                } else {
                    servizio[name] = e.target.value;
                }
            }
            return servizio;
        }));
    }


    // gestione aggiunta/rimozione voli
    const [voli, setVoli] = useState<VoloInputGroup[]>([
        ...initialData.voli
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
                if (name === 'data_partenza') {
                    volo.data_partenza = new Date(e.target.value);
                } else if (name === 'data_arrivo') {
                    volo.data_arrivo = new Date(e.target.value);
                } else {
                    volo[name] = e.target.value;
                }
            }
            return volo;
        }));
    }

    // gestione aggiunta/rimozione assicurazioni
    const [assicurazioni, setAssicurazioni] = useState<AssicurazioneInputGroup[]>([
        ...initialData.assicurazioni
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
            }            return assicurazione;
        }));
    }


    // gestione feedback del form
    type Feedback = {
        message: string;
        type: 'success' | 'error';
    }
    const [feedback, setFeedback] = useState<Feedback>({ message: '', type: 'success' });
    const submit = async () => {
        const data: Data = {
            cliente: cliente,
            preventivo: preventivo,
            serviziATerra: serviziATerra,
            serviziAggiuntivi: serviziAggiuntivi,
            voli: voli,
            assicurazioni: assicurazioni,
        }
        console.log('THE DATA IS: ', data);
        const response = await fetch('/api/preventivi/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if(response.ok) { // preventivo creato con successo
            setFeedback({ message: 'Preventivo creato con successo!', type: 'success' }); 
        } else {
            setFeedback({ message: 'Errore nella risposta del server al submit create preventivo', type: 'error' });
        }
    }
    /** 
    *verifica se cliente inserito esiste già, 
    *se esiste, mostra la lista dei preventivi del cliente
    *se non esiste, mostra il btn per creare un nuovo cliente
    */
    const fetchClienteIsNew = async () => {
        // Esegui la chiamata all'API solo se 
        // showFormPreventivo è false
        if (showFormPreventivo) {
            return;
        }
        try {
            const response = await fetch('/api/clienti', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente),
            });
            if (!response.ok) {
                throw new Error('Errore nella risposta del server');
            }
            const data: ClienteInputGroup[] = await response.json();
            console.log('data: ', data);
            setClientiTrovati(data);
            setShowClientiTrovati(true);
            // Puoi aggiornare lo stato o eseguire altre azioni basate sulla risposta
        } catch (error) {
            console.error('Errore durante la verifica del cliente:', error);
        }
    }

    const onClickMostraListaPreventivi = async (c: ClienteInputGroup) => {
        try {
            const response = await fetch('/api/preventivi/preventivi-by-cliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(c.id),
            });
            if (!response.ok) {
                throw new Error('Errore nella risposta del server');
            }
            const data: PreventivoInputGroup[] = await response.json();
            console.log('data: ', data);
            setPreventiviClienteList(data);
        } catch (error) {
            console.error('Errore durante la ricerca dei preventivi del cliente:', error);
        }
    }

    const fetchDataPreventivoDaAggiornare = async (p: PreventivoInputGroup) => {
        const response = await fetch('/api/preventivi/data-preventivo-completi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(p.id),
        });
        if (!response.ok) {
            throw new Error('Errore nella risposta del server');
        }
        const data: Data = await response.json();
        console.log('data: ', data);
        setPreventivoDaAggiornare(data);
    }

    // gestione lista preventivi di un client
    useEffect(() => {
        fetchClienteIsNew();
        console.log('the cliente state is: ', cliente);
    }, [cliente]);

    useEffect(() => {
        console.log('the preventivo state is: ', preventivo);
    }, [preventivo]);
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


    useEffect(() => {
        if(showFormPreventivo) {setShowPreventiviClienteList(false); setShowClientiTrovati(false);}
        if(showPreventiviClienteList || showClientiTrovati) setShowFormPreventivo(false); 
    }, [showFormPreventivo, showPreventiviClienteList, showClientiTrovati]);
    return (
        <>
            <h1 className={`mb-4 text-xl md:text-2xl`}>CREA PREVENTIVO</h1>
            {/* Cliente */}
            <h3 className="text-xl md:text-2xl pt-4 pb-1">Cliente</h3>
            <div className="flex flex-row">
                <InputEmail label="Email" name="email" onChange={(e) => onVCCliente(e, 'email')} value={cliente?.email} />
                <InputText label="Nome" name="nome" onChange={(e) => onVCCliente(e, 'nome')} value={cliente?.nome} />
                <InputText label="Cognome" name="cognome" onChange={(e) => onVCCliente(e, 'cognome')} value={cliente?.cognome} />
                <InputText label="Note" name="note" onChange={(e) => onVCCliente(e, 'note')} value={cliente?.note} />
                <InputText label="Città" name="citta" onChange={(e) => onVCCliente(e, 'citta')} value={cliente?.citta} />
                <InputText label="Collegato" name="collegato" onChange={(e) => onVCCliente(e, 'collegato')} value={cliente?.collegato} />
                <InputSelect label="Tipo" name="tipo" options={['PRIVATO', 'AGENZIA VIAGGI', 'AZIENDA']} onChange={(e) => onVCCliente(e, 'tipo')} value={cliente?.tipo} />
                <InputDate label="Data di nascita" name="data_di_nascita" onChange={(e) => onVCCliente(e, 'data_di_nascita')} value={formatDate(cliente?.data_di_nascita)} />
                <InputTell label="Telefono" name="tel" onChange={(e) => onVCCliente(e, 'tel')} value={cliente?.tel} />
                <InputSelect label="Provenienza" name="provenienza" options={provenienzaOptions} onChange={(e) => onVCCliente(e, 'provenienza')} value={cliente?.provenienza} />
            </div>

            {/* lista clienti trovati */}
            {showClientiTrovati &&
                <div className="flex flex-col pt-4">
                    <p>Lista clienti corrrispondenti:</p>
                    {clientiTrovati.length > 0 && clientiTrovati.map((c, i) => (
                        <div key={c.id} className="flex flex-col gap-2">
                            <div className="flex flex-row gap-1 pt-4 justify-between">
                                <p> {i + 1}. {c.nome}, {c.cognome}, {c.email}</p>
                                <div className="flex flex-row justify-end gap-2">
                                    <button
                                        className="bg-blue-500 text-white h-8 flex items-center justify-center p-2 rounded-md"
                                        onClick={() => { onClickMostraListaPreventivi(c); setShowPreventiviClienteList(!showPreventiviClienteList); }}
                                    >
                                        {showPreventiviClienteList ? 'Nascondi lista preventivi' : 'Mostra lista preventivi'}
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white h-8 flex items-center justify-center p-2 rounded-md"
                                        onClick={() => { setShowClientiTrovati(false); onClickShowFormNuovoPreventivo(c) }}
                                    >
                                        Nuovo preventivo
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white h-8 flex items-center justify-center p-2 rounded-md"
                                        onClick={() => { setClienteDaAggiornare(c); setShowFormAggiornaCliente(!showFormAggiornaCliente); }}
                                    >
                                        {showFormAggiornaCliente ? 'Annulla' : 'Aggiorna cliente'}
                                    </button>
                                </div>
                            </div>
                            {showFormAggiornaCliente &&
                                <div>
                                    <div className="flex flex-row">
                                        <InputEmail label="Email" name="email" onChange={(e) => onVCClienteDaAggiornare(e, 'email')} value={clienteDaAggiornare?.email} />
                                        <InputText label="Nome" name="nome" onChange={(e) => onVCClienteDaAggiornare(e, 'nome')} value={clienteDaAggiornare?.nome} />
                                        <InputText label="Cognome" name="cognome" onChange={(e) => onVCClienteDaAggiornare(e, 'cognome')} value={clienteDaAggiornare?.cognome} />
                                        <InputText label="Note" name="note" onChange={(e) => onVCClienteDaAggiornare(e, 'note')} value={clienteDaAggiornare?.note} />
                                        <InputText label="Città" name="citta" onChange={(e) => onVCClienteDaAggiornare(e, 'citta')} value={clienteDaAggiornare?.citta} />
                                        <InputText label="Collegato" name="collegato" onChange={(e) => onVCClienteDaAggiornare(e, 'collegato')} value={clienteDaAggiornare?.collegato} />
                                        <InputSelect label="Tipo" name="tipo" options={['PRIVATO', 'AGENZIA VIAGGI', 'AZIENDA']} onChange={(e) => onVCClienteDaAggiornare(e, 'tipo')} value={clienteDaAggiornare?.tipo} />
                                        <InputDate label="Data di nascita" name="data_di_nascita" onChange={(e) => onVCClienteDaAggiornare(e, 'data_di_nascita')} value={formatDate(clienteDaAggiornare?.data_di_nascita)} />
                                        <InputTell label="Telefono" name="tel" onChange={(e) => onVCClienteDaAggiornare(e, 'tel')} value={clienteDaAggiornare?.tel} />
                                        <InputSelect label="Provenienza" name="provenienza" options={provenienzaOptions} onChange={(e) => onVCClienteDaAggiornare(e, 'provenienza')} value={clienteDaAggiornare?.provenienza} />
                                    </div>
                                    <button
                                        className="bg-blue-500 text-white h-8 flex items-center justify-center p-2 rounded-md"
                                        onClick={() => { setShowFormAggiornaCliente(false); updateCliente(clienteDaAggiornare, clienteDaAggiornare.id); fetchClienteIsNew(); }}
                                    >
                                        Aggiorna
                                    </button>
                                </div>
                            }
                        </div>
                    ))}
                    {clientiTrovati.length === 0 &&
                        <div>
                            <div className="flex flex-col pt-4">
                                <p>Nessun cliente corrispondente...</p>
                            </div>
                            <div className="flex flex-row gap-2 pt-4">
                                <button
                                    className="bg-blue-500 text-white h-8 flex items-center justify-center p-2 rounded-md"
                                    onClick={async () => { await createCliente(cliente); fetchClienteIsNew(); }}
                                >
                                    Crea nuovo cliente
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }
            {/* lista preventivi del cliente */}
            {showPreventiviClienteList &&
                <div className="flex flex-col pt-4">
                    <p>Lista preventivi del cliente:</p>
                    {preventiviClienteList.length > 0 && preventiviClienteList.map((p, i) => (
                        <div key={p.id} className="flex flex-row gap-2 pt-4 justify-between">
                            <div > {i + 1}. {formatDate(p.data_partenza)}, {p.riferimento},{p.operatore}</div>
                            <button
                                className="bg-blue-500 text-white h-8 flex items-center justify-center p-2 rounded-md"
                                onClick={() => { setShowFormPreventivo(true); setPreventivoDaAggiornare(p); }}
                            >
                                Aggiorna
                            </button>
                        </div>
                    ))}
                    {preventiviClienteList.length === 0 &&
                        <div className="flex flex-col pt-4">
                            <p>Il cliente non ha preventivi...</p>
                        </div>
                    }
                </div>
            }
            {/* CREA/AGGIORNA PREVENTIVO */}
            {showFormPreventivo &&
                <div>
                    {/* Preventivo Cliente */}
                    <h3 className="text-xl md:text-2xl pt-4 pb-1">Preventivo</h3>
                    <p>I dati seguenti verranno usati per creare il preventivo</p>
                    <div className="flex flex-row">
                        <InputNumber label="N. Preventivo" name="numero_preventivo" onChange={(e) => onVCpreventivo(e, 'numero_preventivo')} value={preventivo?.numero_preventivo?.toString()} />
                        <InputSelect label="Brand" name="brand" options={brandPreventivoOptions} onChange={(e) => onVCpreventivo(e, 'brand')} value={preventivo?.brand} />
                    </div>
                    <div className="flex flex-row">
                        <InputEmail label="Email" name="email" onChange={(e) => onVCpreventivo(e, 'email')} value={preventivo?.email} />
                        <InputText label="Riferimento" name="riferimento" onChange={(e) => onVCpreventivo(e, 'riferimento')} value={preventivo?.riferimento} />
                        <InputText label="Operatore" name="operatore" onChange={(e) => onVCpreventivo(e, 'operatore')} value={preventivo?.operatore} />
                        <InputText label="Feedback" name="feedback" onChange={(e) => onVCpreventivo(e, 'feedback')} value={preventivo?.feedback} />
                        <InputText label="Note" name="note" onChange={(e) => onVCpreventivo(e, 'note')} value={preventivo?.note} />
                        <InputTell label="Telefono" name="numero_di_telefono" onChange={(e) => onVCpreventivo(e, 'numero_di_telefono')} value={preventivo?.numero_di_telefono} />
                        <InputNumber label="Adulti" name="adulti" onChange={(e) => onVCpreventivo(e, 'adulti')} value={preventivo?.adulti?.toString()} />
                        <InputNumber label="Bambini" name="bambini" onChange={(e) => onVCpreventivo(e, 'bambini')} value={preventivo?.bambini?.toString()} />
                        <InputDate label="Data di partenza" name="data_partenza" onChange={(e) => onVCpreventivo(e, 'data_partenza')} value={formatDate(preventivo?.data_partenza)} />
                        <InputDate label="Data" name="data" onChange={(e) => onVCpreventivo(e, 'data')} value={formatDate(preventivo?.data)} />
                        <InputSelect label="Stato" name="stato" options={statoPreventivoOptions} onChange={(e) => onVCpreventivo(e, 'stato')} value={preventivo?.stato} />
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
                                serviziATerra.map((servizio) => (
                                    <div key={servizio.groupId}>
                                        <div className="flex flex-row">
                                            <InputSelect onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'destinazione')} value={servizio?.destinazione} label="Destinazione" name="destinazione" options={destinazioniValues} />
                                            <InputSelect onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'fornitore')} value={servizio?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                            <InputText onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'descrizione')} value={servizio?.descrizione} label="Descrizione" name="descrizione" />
                                            <InputDate onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'data')} value={formatDate(servizio?.data)} label="Data" name="data" />
                                            <InputNumber onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'numero_notti')} value={servizio?.numero_notti?.toString()} label="N. Notti" name="numero_notti" />
                                            <InputNumber onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'totale')} value={servizio?.totale?.toString()} label="Totale" name="totale" />
                                            <InputSelect onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'valuta')} value={servizio?.valuta} label="Valuta" name="valuta" options={['USD', 'EUR']} />
                                            <InputNumber onChange={(e) => onVCServizioATerra(e, servizio.groupId, 'cambio')} value={servizio?.cambio?.toString() ?? '1'} label="Cambio" name="cambio" />
                                            <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                                <div className="pr-3">
                                                    <p>ricarico: {getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico) ?? '0'}</p>
                                                </div>
                                                <div className="pr-3">
                                                    <p>tot euro: {getTot(servizio.totale, servizio.cambio ?? 1, getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico)) ?? '0'}</p>
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
                            <p>somma tot euro: {serviziATerra.reduce((acc, servizio) => acc + getTot(servizio.totale, servizio.cambio ?? 1, getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico)), 0)}</p>
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
                                serviziAggiuntivi.map((servizio) => (
                                    <div key={servizio.groupId}>
                                        <div className="flex flex-row">
                                            <InputSelect onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'destinazione')} value={servizio?.destinazione} label="Destinazione" name="destinazione" options={destinazioniValues} />
                                            <InputSelect onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'fornitore')} value={servizio?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                            <InputText onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'descrizione')} value={servizio?.descrizione} label="Descrizione" name="descrizione" />
                                            <InputDate onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'data')} value={formatDate(servizio?.data)} label="Data" name="data" />
                                            <InputNumber onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'numero_notti')} value={servizio?.numero_notti?.toString()} label="N. Notti" name="numero_notti" />
                                            <InputNumber onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'totale')} value={servizio?.totale?.toString()} label="Totale" name="totale" />
                                            <InputSelect onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'valuta')} value={servizio?.valuta} label="Valuta" name="valuta" options={['USD', 'EUR']} />
                                            <InputNumber onChange={(e) => onVCServizioAggiuntivo(e, servizio.groupId, 'cambio')} value={servizio?.cambio?.toString() ?? '1'} label="Cambio" name="cambio" />
                                            <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                                <div className="pr-3">
                                                    <p>ricarico: {getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico) ?? '0'}</p>
                                                </div>
                                                <div className="pr-3">
                                                    <p>tot euro: {getTot(servizio.totale, servizio.cambio ?? 1, getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico)) ?? '0'}</p>
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
                            <p>somma tot euro: {serviziAggiuntivi.reduce((acc, servizio) => acc + getTot(servizio.totale, servizio.cambio ?? 1, getRicarico(servizio.totale, servizio.cambio ?? 1, percentualeRicarico)), 0)}</p>
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
                                voli.map((volo) => (
                                    <div key={volo.groupId}>
                                        <div className="flex flex-row">
                                            <InputSelect onChange={(e) => onVCVolo(e, volo.groupId, 'fornitore')} value={volo?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                            <InputText onChange={(e) => onVCVolo(e, volo.groupId, 'compagnia')} value={volo?.compagnia} label="Compagnia" name="compagnia" />
                                            <InputText onChange={(e) => onVCVolo(e, volo.groupId, 'descrizione')} value={volo?.descrizione} label="Descrizione" name="descrizione" />
                                            <InputDate onChange={(e) => onVCVolo(e, volo.groupId, 'data_partenza')} value={formatDate(volo?.data_partenza)} label="Partenza" name="data_partenza" />
                                            <InputDate onChange={(e) => onVCVolo(e, volo.groupId, 'data_arrivo')} value={formatDate(volo?.data_arrivo)} label="Arrivo" name="data_arrivo" />
                                            <InputNumber onChange={(e) => onVCVolo(e, volo.groupId, 'totale')} value={volo?.totale?.toString()} label="Totale" name="totale" />
                                            <InputSelect onChange={(e) => onVCVolo(e, volo.groupId, 'valuta')} value={volo?.valuta} label="Valuta" name="valuta" options={['USD', 'EUR']} />
                                            <InputNumber onChange={(e) => onVCVolo(e, volo.groupId, 'cambio')} value={volo?.cambio?.toString() ?? '1'} label="Cambio" name="cambio" />
                                            <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                                <div className="pr-3">
                                                    <p>ricarico: {getRicarico(volo.totale, volo.cambio ?? 1, percentualeRicarico) ?? '0'}</p>
                                                </div>
                                                <div className="pr-3">
                                                    <p>tot euro: {getTot(volo.totale, volo.cambio, getRicarico(volo.totale, volo.cambio ?? 1, percentualeRicarico)) ?? '0'}</p>
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
                            <p>somma tot euro: {voli.reduce((acc, volo) => acc + getTot(volo.totale, volo.cambio ?? 1, getRicarico(volo.totale, volo.cambio ?? 1, percentualeRicarico)), 0)}</p>
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
                                assicurazioni.map((assicurazione) => (
                                    <div key={assicurazione.groupId}>
                                        <div className="flex flex-row">
                                            <InputSelect onChange={(e) => onVCAssicurazione(e, assicurazione.groupId, 'fornitore')} value={assicurazione?.fornitore} label="Fornitore" name="fornitore" options={fornitoriValues} />
                                            <InputText onChange={(e) => onVCAssicurazione(e, assicurazione.groupId, 'assicurazione')} value={assicurazione?.assicurazione} label="Assicurazione" name="assicurazione" />
                                            <InputNumber onChange={(e) => onVCAssicurazione(e, assicurazione.groupId, 'netto')} value={assicurazione?.netto?.toString()} label="Netto" name="netto" />
                                            <div className="flex flex-row items-center justify-center pt-10 pl-5">
                                                <div className="pr-3">
                                                    <p>ricarico: {getRicarico(assicurazione.netto, 1, percentualeRicarico) ?? '0'}</p>
                                                </div>
                                                <div className="pr-3">
                                                    <p>tot euro: {getTot(assicurazione.netto, 1, getRicarico(assicurazione.netto, 1, percentualeRicarico)) ?? '0'}</p>
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
                            <p>somma tot euro: {assicurazioni.reduce((acc, assicurazione) => acc + getTot(assicurazione.netto, 1, getRicarico(assicurazione.netto, 1, percentualeRicarico)), 0)}</p>
                        </div>
                    </div>
                    {/* Totale */}
                    <div className="tot-euro-of-list flex flex-row items-center justify-start pt-4">
                        <p>somma di tutti i tot euro: {getSommaTuttiTotEuro()}</p>
                    </div>
                    <div className="flex flex-row items-center justify-center pt-4 pl-5">
                        <button
                            className="bg-blue-500 text-white h-8 flex items-center justify-center rounded-md px-4"
                            type="button"
                            onClick={submit}
                        >
                            Crea preventivo
                        </button>
                    </div >

                    {feedback.message &&
                        <div className={`flex flex-row items-center justify-center pt-4 pl-5 ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            <p>{feedback.message}</p>
                        </div>
                    }
                </div >
            }
        </>
    );
}
/*
 */

// helper functions to compute totale and ricarico
const getTot = (totale: number, cambio: number, ricarico: number) => {
    if (cambio === 0) {
        return 0;
    }
    const result = (totale / cambio) + ricarico;
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}
const getRicarico = (totale: number, cambio: number, percentualeRicarico: number) => {
    if (cambio === 0) {
        return 0;
    }
    const result = (totale / cambio) * percentualeRicarico;
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}