'use client';

import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { Button } from './button';
import { createUser, State } from '../lib/actions/actions';
import { useActionState } from 'react';
import { lusitana } from './fonts';

export default function RegisterForm() {
    const initialState: State<{email?: string[], password?: string[]}> = {};
    const [state, formAction] = useActionState(createUser, initialState)

  return (
  <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please sign up to continue.
        </h1>
        <div className="w-full">
        <div>
            <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="email"
            >
            Email
            </label>
            <div className="relative">
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                aria-describedby="email-error"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
                {   state.errors?.email &&
                    state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
        </div>
        <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                aria-describedby="password-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
                {   state.errors?.password &&
                    state.errors.password.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
        </div>
        </div>
        <Button className="mt-4 w-full" type="submit">Sign up</Button>
        <div className="flex h-8 items-end space-x-1">
        {state.dbError && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.dbError}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
