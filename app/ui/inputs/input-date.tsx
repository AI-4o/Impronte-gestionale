'use client'
import { useState } from "react";
import { InputInterface } from "./input-interface";
import './inputs-style.css';
export default function InputDate({
    label, 
    name, 
    state, 
    value, 
    onChange
}: InputInterface) {   
    const [inputValue, setInputValue] = useState(value ?? '');
    const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if(onChange) onChange(e);
    }
    return (
    <div className="flex flex-col min-w-64 date">
        <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="date"
        >
            {label}
        </label>
        <div className="relative">
         <input
                className="date peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="date"
                type="date"
                name={name}
                placeholder="Enter the date"
                value={inputValue}
                onChange={e => _onChange(e)}
            />
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