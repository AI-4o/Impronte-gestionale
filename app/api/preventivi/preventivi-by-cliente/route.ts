// pages/api/check-client.ts
import { NextRequest, NextResponse } from 'next/server';
import { DBResult} from '@/app/lib/actions/actions';
import { fetchPreventiviByIdCliente } from '@/app/lib/data';
import { PreventivoInputGroup } from '@/app/dashboard/(overview)/general-interface/general-interface.defs';

// get preventivi by cliente
export async function POST(request: NextRequest) {
        const  clienteId: string = await request.json();
        // Esegui la logica lato server qui
        const preventiviByClienteDBResult = await getPreventiviInputGroupByCliente(clienteId);
        console.log("Dato ricevuto nell'API route preventivi-by-cliente:", clienteId);
        console.log("Dato restituito dall'API route preventivi-by-cliente: ", preventiviByClienteDBResult);
        return NextResponse.json(preventiviByClienteDBResult);
}
const getPreventiviInputGroupByCliente = async (clienteId: string): Promise<DBResult<PreventivoInputGroup[]>> => {
    const preventiviDBResult = await fetchPreventiviByIdCliente(clienteId);
    preventiviDBResult.values = preventiviDBResult.values.map(p => new PreventivoInputGroup(p.numero_preventivo, p.brand, p.riferimento, p.operatore, p.feedback, p.note, p.adulti, p.bambini, p.data_partenza, p.data, p.stato, p.id));
    return preventiviDBResult;
  } 