import { TEntityList } from "@/app/lib/definitions";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function EntityInputSelect({ data, defaultValue }: { data: TEntityList<any>, defaultValue?: string }) {

    return (
        <>
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="date"
            >
                {data.entityName}
            </label>
            <div className="relative">
                <select
                    id={`dependency-${data.entityName}-input-select`}
                    name={`dependency-${data.entityName}-input-select`}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue={defaultValue ?? ''}
                >
                    <option value="" disabled>
                        Select a {data.entityName}
                    </option>
                    {data.data.map((entity) => (
                        <option key={entity.id} value={entity.id}>
                            {Object.keys(entity).map((key) => {
                                return (<span key={key}> {entity[key]} - </span>);
                            })}
                        </option>
                    ))}
                </select>
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
        </>
    );
}