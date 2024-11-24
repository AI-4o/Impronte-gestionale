export default function InputText({ label, name, state, defaultValue }: { label: string, name: string, state?: any, defaultValue?: string }) {

    return (
        <div>
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="date"
            >
                {label}
            </label>
            <input
                id={label}
                name={name}
                type="text"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                placeholder={`Enter text for ${label}`}
                defaultValue={defaultValue ?? ''}
            />
            <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
                {state?.errors?.[name] &&
                    state?.errors[name].map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                        </p>
                ))}
                </div>
        </div>
    );
}