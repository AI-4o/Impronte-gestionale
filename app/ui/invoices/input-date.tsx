import { useState } from "react";

export default function InputDate({label, name, state, defaultValue}: {label: string, name: string, state?: any, defaultValue?: string }) {
    function formatDate(defaultValue: string): string {
        const date = new Date(defaultValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
   
    const [isDateRequired, setIsDateRequired] = useState(false)
    
    if (defaultValue) {
        defaultValue = formatDate(defaultValue);
    }
    return (
    <div className="flex flex-col min-w-64">
        <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="date"
        >
            {label}
        </label>
        <div className="relative">
            <button onClick={() => setIsDateRequired(!isDateRequired)}>
                {isDateRequired ? 'Hide' : 'Show'}
            </button>
            {isDateRequired && <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="date"
                type="date"
                name={name}
                placeholder="Enter the date"
                defaultValue={defaultValue ?? ''}
            />}
        </div>
        <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
                {   state?.errors?.[name] &&
                    state?.errors[name].map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
    </div>
    );
}