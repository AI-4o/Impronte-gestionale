import { InputInterface } from "./input-interface";
import './inputs-style.css';
export default function InputSelect({
    label,
    options,
    name,
    state,
    value,
    onChange
}: InputInterface & { options: string[] }) {
    
    return (
        <div className="select">
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="date"
            >
                {label}
            </label>
            <div className="relative">
                <select
                    id={label}
                    name={name}
                    className="select h-input-height peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm  placeholder:text-gray-500"
                    value={value ?? ''}
                    onChange={onChange}
                >
                    <option value="" disabled className="text-gray-500">
                        
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
        </div>
    );
}