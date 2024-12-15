import { AtSymbolIcon } from "@heroicons/react/16/solid";

export default function InputEmail({
  state, 
  label, 
  defaultValue, 
  handleInputChange
}: {
  state?: any, 
  label: string, 
  defaultValue?: string, 
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {

    return (
        <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              {label}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name={label}
                placeholder="Enter the email address"
                value={defaultValue ?? ''}
                required
                onChange={handleInputChange}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
                {   state?.errors?.email &&
                    state?.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>    
          </div>
    );
}