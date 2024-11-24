import clsx from 'clsx';
import InputDate from "./input-date";
import { EntityKey } from "@/app/lib/entities.utils";
import InputTell from "./input-tell";
import InputEmail from "./input-email";
import InputSelect from "./input-select";
import InputState from "./input-state";
import InputText from "./input-text";
import InputNumber from "./input-number";
import { format } from 'date-fns';
import { SetStateAction } from 'react';

export default function EntityInputGroup({ 
    entityKeys, 
    recordModel, 
    state, 
    inline = false, 
    setRecordModel
}: { 
    entityKeys: EntityKey[], 
    recordModel?: any, 
    state?: any, 
    inline?: boolean, 
    setRecordModel?: (value: SetStateAction<any>) => void
}) {

    let _entityKeys = entityKeys.filter(k => k.type !== "foreign_key");

    return (
        <div className={clsx(
            inline && 'flex flex-row gap-2 flex-wrap ',
          )}>
            {_entityKeys.map((k, i) => {
                let recordModelKeyValue = recordModel?.[k.keyName] ?? null;
                return (
                    <div key={i} className="flex flex-col p-2  align-start justify-start shadow-sm">
                        {(() => {
                            switch (k.type) {
                                case "date":
                                    if(!recordModelKeyValue) recordModelKeyValue = new Date();
                                    recordModelKeyValue = format(recordModelKeyValue as Date, 'yyyy-MM-dd');
                                    return <InputDate 
                                        label={k.keyName} 
                                        name={k.keyName} 
                                        state={state} 
                                        defaultValue={recordModelKeyValue} 
                                        handleInputChange={(e) => setRecordModel && 
                                            setRecordModel(prevState => ({ ...prevState, [k.keyName]: e.target.value }))}
                                    />;
                                case "telefono":
                                    return <InputTell 
                                        state={state} 
                                        label={k.keyName} 
                                        defaultValue={recordModelKeyValue} 
                                        handleInputChange={(e) => setRecordModel && 
                                            setRecordModel(prevState => ({ ...prevState, [k.keyName]: e.target.value }))}
                                    />;
                                case "email":
                                    return <InputEmail 
                                        state={state} 
                                        label={k.keyName} 
                                        defaultValue={recordModelKeyValue} 
                                        handleInputChange={(e) => setRecordModel && 
                                            setRecordModel(prevState => ({ ...prevState, [k.keyName]: e.target.value }))}
                                    />;
                                case "enum":
                                    return <InputSelect 
                                        label={k.keyName} 
                                        options={k.values} 
                                        state={state} 
                                        defaultValue={recordModelKeyValue} 
                                        handleInputChange={(e) => setRecordModel && 
                                            setRecordModel(prevState => ({ ...prevState, [k.keyName]: e.target.value }))}
                                    />;
                                case "boolean":
                                    return <InputState 
                                        stateName={k.keyName} 
                                        defaultValue={recordModelKeyValue} 
                                        handleInputChange={(e) => setRecordModel && 
                                            setRecordModel(prevState => ({ ...prevState, [k.keyName]: e.target.value }))}
                                    />;
                                case 'number':
                                    return <InputNumber 
                                        id={k.keyName} 
                                        name={k.keyName} 
                                        label={k.keyName} 
                                        state={state} 
                                        defaultValue={recordModelKeyValue} 
                                        handleInputChange={(e) => setRecordModel && 
                                            setRecordModel(prevState => ({ ...prevState, [k.keyName]: e.target.value }))}
                                    />;
                                default:
                                    return <InputText 
                                            label={k.keyName} 
                                            name={k.keyName} 
                                            state={state} 
                                            defaultValue={recordModelKeyValue} 
                                            handleInputChange={(e) => setRecordModel && 
                                                setRecordModel(prevState => ({ ...prevState, [k.keyName]: e.target.value }))}
                                        />;
                            }
                        })()}
                    </div>
                );
            })}
        </div>
    );
}