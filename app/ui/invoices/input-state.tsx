import { CheckIcon, ClockIcon } from "@heroicons/react/16/solid";

/**
 * Input per impostare lo stato booleano di un'entità
 * @returns 
 */
export default function InputState({stateName, defaultValue}:{stateName: string, defaultValue?: string}) {

    return (
        <fieldset>
        <legend className="mb-2 block text-sm font-medium">
            Set the {stateName}
        </legend>
        <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
                <div className="flex items-center">
                    <input
                        id="pending"
                        name="status"
                        type="radio"
                        value="in-attesa"
                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        defaultChecked={defaultValue === 'in-attesa'}
                    />
                    <label
                        htmlFor="pending"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                    >
                        In Attesa <ClockIcon className="h-4 w-4" />
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="paid"
                        name="status"
                        type="radio"
                        value="confermato"
                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    />
                    <label
                        htmlFor="paid"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                    >
                        Confermato <CheckIcon className="h-4 w-4" />
                    </label>
                </div>
            </div>
        </div>
    </fieldset>
    );
}