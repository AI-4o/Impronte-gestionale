'use client';

import { useSpinnerContext } from "@/app/context/spinner-context";
import { addFundamentalEntity, DBResult, setOptionsJson } from "@/app/lib/actions/actions";
import Feedback from "@/app/ui/feedback/feedback";
import InputSelect from "@/app/ui/inputs/input-select";
import InputText from "@/app/ui/inputs/input-text";
import { useEffect, useState } from "react";

export default function AggiungiPage() {
    const aggiungiOptions = [
        { name: 'fornitore', value: 'fornitori' },
        { name: 'banca', value: 'banche' },
        //{ name: 'brand', value: 'brand' },
        //{ name: 'operatore', value: 'operatori' },
        //{ name: 'tipo cliente', value: 'tipi cliente' },
        //{ name: 'provenienza cliente', value: 'provenienze cliente' },
        { name: 'destinazione', value: 'destinazioni' },
        //{ name: 'valuta', value: 'valute' }
    ];

    const [newEntity, setNewEntity] = useState<{ tableName?: string, value?: string }>(null);

    const onSelectedOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewEntity(val => ({ ...val, tableName: e.target.value }));
    };

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEntity(val => ({ ...val, value: e.target.value }));
    };

    // feedback
    const { setIsActiveSpinner, isActiveSpinner } = useSpinnerContext(); // use context to set the spinner state
    const [feedback, setFeedback] = useState<DBResult<any>>(null);

    const addEntity = async () => {
        setFeedback(null);
        setIsActiveSpinner(true);
        const result = await addFundamentalEntity(newEntity.tableName, newEntity.value);
        setIsActiveSpinner(false);
        setTimeout(() => {
            setFeedback(result);
        }, 200);
        await setOptionsJson();
        if (result.success) {
            setTimeout(() => {
                setFeedback(null);
            }, 2200);
        }
    };

    useEffect(() => {
        console.log('the newEntity: ', newEntity);
    }, [newEntity]);

    return (
        <div>
            <h1 className="mb-4 text-xl md:text-2xl">AGGIUNGI</h1>
            <p>Usando il form di sotto e' possibile aggiungere nuove entita' al database.</p>
            <div className="flex align-center">
                <InputSelect
                    label="tipo entity"
                    name="aggiungi-entity"
                    value={newEntity?.tableName}
                    options={aggiungiOptions}
                    onChange={onSelectedOption}
                />
                <InputText
                    label="valore"
                    name="valore"
                    value={newEntity?.value}
                    onChange={onValueChange}
                />
                <div className="flex items-end justify-center">
                    <button
                        className="bg-blue-500 text-white h-8 flex items-center justify-center p-2 ml-2 mb-1 rounded-md"
                        onClick={addEntity}
                    >
                        Aggiungi
                    </button>
                </div>
            </div>
            {feedback && <Feedback<any> result={feedback} />}
        </div>
    );
}
