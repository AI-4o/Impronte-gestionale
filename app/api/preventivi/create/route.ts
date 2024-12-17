import { NextRequest, NextResponse } from 'next/server';
import { submitCreatePreventivoGI } from '@/app/lib/actions/actions';
import { Data } from '@/app/dashboard/(overview)/general-interface-create/general-interface.defs';

// get preventivi by cliente
export async function POST(request: NextRequest) {
    try {
        const  data: Data = await request.json();
        // Esegui la logica lato server qui
        const res = await submitCreatePreventivoGI(data);
        console.log("Dato ricevuto nell'API route createPreventivo:", data);
        console.log("Dato restituito dall'API route createPreventivo: ", res);
        return NextResponse.json('preventivo creato con successo', { status: 200 });
    } catch (error) {
        console.error('Errore nell\'API route:', error);
        return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
    }
}