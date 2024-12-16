'use client'
import { useState } from "react";
import { InputInterface } from "./input-interface";

export default function InputTell({
    state, 
    label, 
    name,
    value, 
    onChange
}: InputInterface) {

    return (
    <div>
        <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor={label}
        >
            {label}
        </label>
        <div className="relative">
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                id={label}
                type="text"
                name={name}
                placeholder="phone"
                pattern="^\+[1-9]\d{1,14}$"
                value={value ?? ''}
                onChange={onChange}
            />
            <p className="mt-2 text-sm text-red-600 hidden peer-invalid:block">
                Please enter a valid international phone number.
            </p>
        </div>
        <div id="tel-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.tel &&
                state?.errors.tel.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}
        </div>
    </div>
    );
}