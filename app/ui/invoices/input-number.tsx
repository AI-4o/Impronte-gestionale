
export default function InputNumber(
    { 
        id, name, 
        state, 
        label, 
        defaultValue, 
        handleInputChange 
    }: 
    { 
        id: string, 
        name: string, 
        state?: any, 
        label: string, 
        defaultValue?: string, 
        handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void 
    }) {

    return (
        <div className="mb-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="date"
            >
                {label}
            </label>
            <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <input
                        id={id}
                        name={name}
                        placeholder={`Enter number`}
                        className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby={`${id}-error`}
                        defaultValue={defaultValue ?? ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
                    {state?.errors?.[id] &&
                        state?.errors[id].map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
}