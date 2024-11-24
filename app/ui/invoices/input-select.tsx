
export default function InputSelect({ label, options, state, defaultValue }: { label: string, options: string[], state: any, defaultValue?: string }) {

    return (
        <>
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="date"
            >
                {label}
            </label>
            <div className="relative">
                <select
                    id={label}
                    name={label}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue={defaultValue ?? ''}
                >
                    <option value="" disabled className="text-gray-500">
                        Select {label}
                    </ option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </ option>
                    ))}
                </select>   
            </div>
            <div id={`${label}-error`} aria-live="polite" aria-atomic="true">
                {state?.errors?.[label] &&
                    state?.errors[label].map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                        </p>
                ))}
            </div>
        </>
    );
}