'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { entities, EntityKey, entitiesKeysDictionary } from '@/app/lib/entities.utils';
import EntityInputGroup from './entity-input-group';
import { useActionState } from 'react';
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
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { Entity } from '@/app/lib/definitions';
export interface UpdateRecordFormInterface<T> {
    recordModelName: (typeof entities[number]['name']);
    recordModel: Entity;
    //dependenciesData: TEntityList<any>[];
}
export default function UpdateRecordForm<T>({
    recordModelName,
    recordModel,
    //dependenciesData
}: UpdateRecordFormInterface<T>) {
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
        values: recordModel
    }
    // array of the keys of the record model
    const recordModelKeys = entitiesKeysDictionary[recordModelName] as EntityKey[];
    const [state, formAction] = useActionState(updateActions[recordModelName], initialState);

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* select dependencies to associate to the new record */}
                {/*dependenciesData.map((data, i) => {
                    return <div key={i} className="mb-4">
                        <EntityInputSelect data={data} defaultValue={recordModel[data.entityName] ?? ''} />
                    </div>
                })}*/}
                <br />
                <EntityInputGroup entityKeys={recordModelKeys} recordModel={recordModel} state={state}/> {/** add state */}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Indietro
                </Link>
                <Button type="submit">Aggiorna {recordModelName}</Button>
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
            </div>
        </form>
    );
}