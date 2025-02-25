import { fetchAllPreventiviWithCliente } from "@/app/lib/data";
import { Preventivo } from "@/app/lib/definitions";
import { Cliente } from "@/app/lib/definitions";
import { STable } from "@/app/ui/table/table";

type R = Preventivo & { cliente: Cliente }
export default async function Page() {

    const preventivi = await fetchAllPreventiviWithCliente();
    const rows = preventivi.values.map((p) => {
        const { cliente, ...preventivo } = p;
        const flattenedObject = {
            ...cliente,
            ...preventivo
        };
        return Object.fromEntries(
            Object.entries(flattenedObject)
                //.filter(([key]) => !key.includes('id'))
                .map(
                    ([key, value]) => {
                        if (value instanceof Date) return [key, value.toLocaleDateString()];
                        return [key, value];
                    }
                )
        );
    });
    return (
        <div>
            <h1 className="mb-4 text-xl md:text-2xl">TABELLA PREVENTIVI</h1>
            {
                preventivi.success &&
                <STable<R> data={rows} columnsSize={200} />
            }
            {!preventivi.success && <div>Error fetching data</div>}
        </div>
    );
}