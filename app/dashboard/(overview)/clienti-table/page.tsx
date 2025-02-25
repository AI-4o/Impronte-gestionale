import { getAllClienti } from "@/app/lib/actions/actions";
import { TableClienti } from "@/app/ui/table-wrapper/table-wrapper-clienti";

export default async function Page() {
    const clienti = await getAllClienti();

    return (
        <div>
            <h1 className="mb-4 text-xl md:text-2xl">TABELLA CLIENTI</h1>
            <TableClienti data={clienti} />
        </div>
    );
}
