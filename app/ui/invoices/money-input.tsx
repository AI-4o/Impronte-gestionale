import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function MoneyInput({ id, name, state, label, defaultValue }: { id: string, name: string, state?: any, label: string, defaultValue?: string }) {

    return (
        <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                Choose an amount for {label}
            </label>
            <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <input
                        id={id}
                        name={name}
                        type="number"
                        step="0.01"
                        placeholder={`Enter amount for ${label}`}
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby={`${id}-error`}
                        defaultValue={defaultValue ?? ''}
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
                    {state.errors?.[id] &&
                        state.errors[id].map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
}