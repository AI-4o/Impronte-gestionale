import { fetchAllPreventiviAlCliente } from "@/app/lib/data";
import { PreventivoAlCliente } from "@/app/lib/definitions";
import { STable } from "@/app/ui/table/table";

export default async function TestPage() {
  const preventiviAlCliente = await fetchAllPreventiviAlCliente();

  const rows = preventiviAlCliente.values.map((p: PreventivoAlCliente) => p);
  return <div>
    <h1 className="mb-4 text-xl md:text-2xl">ALTRE TABELLE</h1>
    
    <h2 className="mb-4 text-lg md:text-xl">Preventivi al cliente</h2>
    <STable<PreventivoAlCliente> data={rows} />
    </div>;
}