'use client'
import { useState } from "react";
import { InputInterface } from "./input-interface";
import './inputs-style.css';

export default function InputNumber(
    { 
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
        <div className="number">
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor={label}
            >
                {label}
            </label>
            <input
                id={label}
                name={name}
                type="number"
                className="number block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                value={inputValue}
                placeholder={`number`}
                onChange={e => _onChange(e)}
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