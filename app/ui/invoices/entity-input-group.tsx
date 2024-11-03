import InputDate from "./input-date";
import { EntityKey } from "@/app/lib/entities.utils";
import InputTell from "./input-tell";
import InputEmail from "./input-email";
import InputSelect from "./input-select";
import InputState from "./input-state";
import InputText from "./input-text";
import MoneyInput from "./money-input";
export default function EntityInputGroup({ entityKeys, recordModel, state }: { entityKeys: EntityKey[], recordModel?: any, state?: any }) {

    let _entityKeys = entityKeys.filter(k => k.type !== "foreign_key");
    //console.log('lkjhgfds', _entityKeys);

    return (
        <div>
            {_entityKeys.map((k, i) => {
                const recordModelKeyValue = recordModel ? recordModel[k.keyName] : null;
                switch (k.type) {
                    case "date":
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