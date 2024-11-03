export default function InputNumber({label, state}: {label: string, state: any}) {

    return (
    <div>
        <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="number"
        >
            Number for {label}
        </label>
        <div className="relative">
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="number"
                type="number"
                name={label}
                placeholder={`Enter the number for ${label}`}
                required
            />
        </div>
        <div id={`${label}-error`} aria-live="polite" aria-atomic="true">
                    {state.errors?.[label] &&
                        state.errors[label].map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                ))}
        </div>
    </div>
    );
}