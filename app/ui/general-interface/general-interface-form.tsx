'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { entities, EntityKey, entitiesKeysDictionary } from '@/app/lib/entities.utils';
import { useActionState, useEffect, useState } from 'react';
import './style.css';
import {
    updateAssicurazione,
    updateBanca,
    updateCliente,
    updateDestinazione,
    updateFornitore,
    updateIncassoPartecipante,
    updatePagamentoServizioATerra,
    updatePagamentoVolo,
    updatePartecipante,
    updatePratica,
    updatePreventivo,
    updatePreventivoMostrareCliente,
    updateServizioATerra,
    updateVolo
} from '@/app/lib/actions/actions';
import EntityInputGroup from '../invoices/entity-input-group';
import clsx from 'clsx';
import Modal from '../invoices/modal';
import { Cliente, Preventivo, Transazione } from '@/app/lib/definitions';
import InputText from '../invoices/input-text';

export default function GeneralInterfaceForm() {
    const updateActions = {
        clienti: updateCliente,
        destinazioni: updateDestinazione,
        fornitori: updateFornitore,
        preventivi: updatePreventivo,
        preventivi_mostrare_clienti: updatePreventivoMostrareCliente,
        servizi_a_terra: updateServizioATerra,
        voli: updateVolo,
        incassi_partecipanti: updateIncassoPartecipante,
        pagamenti_voli: updatePagamentoVolo,
        pagamenti_servizi_a_terra: updatePagamentoServizioATerra,
        partecipanti: updatePartecipante,
        assicurazioni: updateAssicurazione,
        banche: updateBanca,
        pratiche: updatePratica,
    }
    const initialState = {
        errors: {},
        dbError: '',
        message: '',
        // values: recordModel
    }
    //const [state, formAction] = useActionState(updateActions[recordModelName], initialState);


    // cliente
    const clienteKeys = entitiesKeysDictionary['clienti'] as EntityKey[];
    const [showClienteInputs, setShowClienteInputs] = useState(true);
    const [clienteRecordModel, setClienteRecordModel] = useState<Cliente>(undefined); // TODO: per ora null, poi aggiornare
    useEffect(() => { // DEBUG
        console.log(clienteRecordModel);
    }, [clienteRecordModel]);
    
    // preventivo
    const preventivoKeys = entitiesKeysDictionary['preventivi'] as EntityKey[];
    const [showPreventivoInputs, setShowPreventivoInputs] = useState(true);

    // servizi a terra
    const {
        renderedInputGroup: serviziATerraRenderedInputs,
        updateRenderedInputGroup: updateServiziATerraInputs
    } = useDynamicallyRenderedInputGroup('servizi_a_terra');

    // voli
    const {
        renderedInputGroup: voliRenderedInputs,
        updateRenderedInputGroup: updateVoliInputs
    } = useDynamicallyRenderedInputGroup('voli');

    // assicurazioni
    const {
        renderedInputGroup: assicurazioniRenderedInputs,
        updateRenderedInputGroup: updateAssicurazioniInputs
    } = useDynamicallyRenderedInputGroup('assicurazioni');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    }
    return (
        <>
            <Button onClick={() => { setIsModalOpen(true) }}>open</Button>
            <Modal
                setIsOpen={setIsModalOpen}
                isOpen={isModalOpen}
                footer={<Button onClick={() => setIsModalOpen(false)}>close</Button>}
            />
            <InputText
                label={'test'}
                name={'test'}
                defaultValue={''}
                handleInputChange={handleInputChange}
            />
            <form >
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    {/* cliente */}
                    <div className="flex flex-row gap-2 flex-wrap my-6">
                        <p className='entity-input-group-label'>Cliente</p>
                        <button onClick={() => setShowClienteInputs(!showClienteInputs)} className="arrow-icon">
                            {showClienteInputs ? '▲' : '▼'}
                        </button>
                        <div className={clsx(
                            'transition-all duration-300',
                            showClienteInputs ? 'flex flex-row gap-2 flex-wrap' : 'hidden'
                        )}>
                            <EntityInputGroup 
                                entityKeys={clienteKeys} 
                                inline={true} 
                                recordModel={clienteRecordModel}
                                setRecordModel={setClienteRecordModel}
                            />
                        </div>
                    </div>
                    {/* preventivo cliente */}
                    <div className="flex flex-row gap-2 flex-wrap my-6">
                        <p className='entity-input-group-label'>Preventivo Cliente</p>
                        <button onClick={() => setShowPreventivoInputs(!showPreventivoInputs)} className="arrow-icon">
                            {showPreventivoInputs ? '▲' : '▼'}
                        </button>
                        <div className={clsx(
                            'transition-all duration-300',
                            showPreventivoInputs ? 'flex flex-row gap-2 flex-wrap' : 'hidden'
                        )}>
                            <EntityInputGroup entityKeys={preventivoKeys} inline={true} />
                        </div>
                    </div>
                    {/* servizi a terra */}
                    <div className="input-group-container gap-2 flex-wrap my-6">
                        <div className="flex flex-row gap-2 flex-wrap"  >
                            <p className='entity-input-group-label'>Servizi a Terra</p>
                            <Button onClick={() => updateServiziATerraInputs(true)}>+</Button>
                            {serviziATerraRenderedInputs.length > 0 &&
                                <Button onClick={() => updateServiziATerraInputs(false)}>-</Button>
                            }
                        </div>
                        {serviziATerraRenderedInputs}
                    </div>
                    {/* voli */}
                    <div className="input-group-container gap-2 flex-wrap my-6">
                        <div className="flex flex-row gap-2 flex-wrap"  >
                            <p className='entity-input-group-label'>Voli</p>
                            <Button onClick={() => updateVoliInputs(true)}>+</Button>
                            {voliRenderedInputs.length > 0 && <Button onClick={() => updateVoliInputs(false)}>-</Button>}
                        </div>
                        {voliRenderedInputs}
                    </div>
                    {/* assicurazioni */}
                    <div className="input-group-container gap-2 flex-wrap my-6">
                        <div className="flex flex-row gap-2 flex-wrap"  >
                            <p className='entity-input-group-label'>Assicurazioni</p>
                            <Button onClick={() => updateAssicurazioniInputs(true)}>+</Button>
                            {assicurazioniRenderedInputs.length > 0 && <Button onClick={() => updateAssicurazioniInputs(false)}>-</Button>}
                        </div>
                        {assicurazioniRenderedInputs}
                    </div>

                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/dashboard"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Indietro
                    </Link>
                    <Button type="submit">Aggiorna</Button>

                </div>
            </form>
        </>
    );
}


/** 
 * Custom hook to create an input group associated to an entity.
 * It adds or removes the following:
 * 1. an EntityInputGroup
 * 2.  
 * 
 *  */
function useDynamicallyRenderedInputGroup(entityName: string) {
    /** 
     * creates the input group for the entity with entityDefaultValues, 
     * and allows management of payments 
     * starting from the data of 'paymentsDefaultValues' */
    const renderInputGroup = (index: number, entityDefaultValues?: any, paymentsDefaultValues?: Transazione[]): JSX.Element => {

        
        return (
        <div className="flex gap-2 flex-wrap input-group-container" key={index}>
            <p>{entityName.replace(/_/g, ' ')} {index + 1}</p>
            <EntityInputGroup
                entityKeys={entitiesKeysDictionary[entityName] as EntityKey[]}
                recordModel={entityDefaultValues}
                inline={true}
            />
        </div>
    )};

    const [renderedInputGroup, setRenderedInputGroup] = useState([renderInputGroup(0)]);

    const updateRenderedInputGroup = (add: boolean) => {
        if (add) {
            setRenderedInputGroup(prevState => prevState.concat(renderInputGroup(prevState.length)));
        } else {
            setRenderedInputGroup(prevState => prevState.slice(0, prevState.length - 1));
        }
    };

    return { renderedInputGroup, updateRenderedInputGroup };
}

/**
 
import InputDate from "./input-date";
import { EntityKey } from "@/app/lib/entities.utils";
import InputTell from "./input-tell";
import InputEmail from "./input-email";
import InputSelect from "./input-select";
import InputState from "./input-state";
import InputText from "./input-text";
import MoneyInput from "./money-input";
import { format } from 'date-fns';
export default function EntityInputGroup({ entityKeys, recordModel, state }: { entityKeys: EntityKey[], recordModel?: any, state?: any }) {

    let _entityKeys = entityKeys.filter(k => k.type !== "foreign_key");
    //console.log('lkjhgfds', _entityKeys);

    return (
        <div>
            {_entityKeys.map((k, i) => {
                let recordModelKeyValue = recordModel ? recordModel[k.keyName] : null;
                switch (k.type) {
                    case "date":
                        recordModelKeyValue = format(recordModelKeyValue as Date, 'yyyy-MM-dd');
                        return <InputDate key={i} label={k.keyName} name={k.keyName} state={state} defaultValue={recordModelKeyValue} />;
                    case "telefono":
                        return <InputTell key={i} state={state} label={k.keyName} defaultValue={recordModelKeyValue} />;
                    case "email":
                        return <InputEmail key={i} state={state} label={k.keyName} defaultValue={recordModelKeyValue} />;
                    case "enum":
                        return <InputSelect key={i} label={k.keyName} options={k.values} state={state} defaultValue={recordModelKeyValue} />;
                    case "boolean":
                        return <InputState key={i} stateName={k.keyName} defaultValue={recordModelKeyValue} />;
                    case 'number':
                        return <MoneyInput id={k.keyName} name={k.keyName} key={i} label={k.keyName} state={state} defaultValue={recordModelKeyValue} />;
                    default:
                        return <InputText key={i} label={k.keyName} name={k.keyName} state={state} defaultValue={recordModelKeyValue} />;
                }
            })}
        </div>

    );
}

// ### ending of form for error messages ---> to add later ###
<div className="flex h-8 items-end space-x-1">
                    {state.dbError && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{state.dbError}</p>
                        </>
                    )}
                </div>
                <div className="flex h-8 items-end space-x-1">
                    {state.message && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{state.message}</p>
                        </>
                    )}
                </div>
 */