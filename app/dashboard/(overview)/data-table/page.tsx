import { fetchAllPreventiviWithCliente } from "@/app/lib/data";
import { flattenObject } from "@/app/lib/utils";
import Table from "@/app/ui/table/table";


export default async function Page() {

    const preventivi = await fetchAllPreventiviWithCliente();
    let preventiviForTable: Record<string, any>[][] = [];
    if (preventivi.success) {
        preventiviForTable = preventivi.values.map(preventivo => 
            flattenObject(preventivo).filter(item => 
                !item.nome.includes('id') && 
                !item.nome.includes('percentuale_ricarico') &&
                !item.nome.includes('note') &&
                !item.nome.includes('riferimento') &&
                !item.nome.includes('provenienza') &&
                !item.nome.includes('indirizzo') &&
                !item.nome.includes('feedback') &&
                !item.nome.includes('numero_preventivo') &&
                !item.nome.includes('citta') &&
                !item.nome.includes('provincia') &&
                !item.nome.includes('cap') &&
                !item.nome.includes('tel') &&
                !item.nome.includes('tipo') &&
                !item.nome.includes('collegato') &&
                !item.nome.includes('cliente.cf')
            )
        );
    }
    return (
        <div>
            <h1>DataTable</h1>
            {
                preventivi.success &&
                <Table data={preventiviForTable} minWidths={[50, 50, 50, 300, 100, 200, 150, 150, 150, 150]} />
            }
            {!preventivi.success && <div>Error fetching data</div>}
        </div>
    );
}