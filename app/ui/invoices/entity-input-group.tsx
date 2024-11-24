import clsx from 'clsx';
import InputDate from "./input-date";
import { EntityKey } from "@/app/lib/entities.utils";
import InputTell from "./input-tell";
import InputEmail from "./input-email";
import InputSelect from "./input-select";
import InputState from "./input-state";
import InputText from "./input-text";
import NumberInput from "./money-input";
import { format } from 'date-fns';

export default function EntityInputGroup({ entityKeys, recordModel, state, inline = false }: { entityKeys: EntityKey[], recordModel?: any, state?: any, inline?: boolean }) {

    let _entityKeys = entityKeys.filter(k => k.type !== "foreign_key");
    //console.log('lkjhgfds', _entityKeys);

    return (
        <div className={clsx(
            inline && 'flex flex-row gap-2 flex-wrap ',
          )}>
            {_entityKeys.map((k, i) => {
                let recordModelKeyValue = recordModel ? recordModel[k.keyName] : null;
                return (
                    <div key={i} className="flex flex-col p-2  align-start justify-start shadow-sm">
                        {(() => {
                            switch (k.type) {
                                case "date":
                                    recordModelKeyValue = format(recordModelKeyValue as Date, 'yyyy-MM-dd');
                                    return <InputDate label={k.keyName} name={k.keyName} state={state} defaultValue={recordModelKeyValue} />;
                                case "telefono":
                                    return <InputTell state={state} label={k.keyName} defaultValue={recordModelKeyValue} />;
                                case "email":
                                    return <InputEmail state={state} label={k.keyName} defaultValue={recordModelKeyValue} />;
                                case "enum":
                                    return <InputSelect label={k.keyName} options={k.values} state={state} defaultValue={recordModelKeyValue} />;
                                case "boolean":
                                    return <InputState stateName={k.keyName} defaultValue={recordModelKeyValue} />;
                                case 'number':
                                    return <NumberInput id={k.keyName} name={k.keyName} label={k.keyName} state={state} defaultValue={recordModelKeyValue} />;
                                default:
                                    return <InputText label={k.keyName} name={k.keyName} state={state} defaultValue={recordModelKeyValue} />;
                            }
                        })()}
                    </div>
                );
            })}
        </div>
    );
}