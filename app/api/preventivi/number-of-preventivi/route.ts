import { NextRequest, NextResponse } from 'next/server';
import { submitCreatePreventivoGI } from '@/app/lib/actions/actions';
import { Data } from '@/app/dashboard/(overview)/general-interface/general-interface.defs';
import { getNumberOfPreventivi } from '@/app/lib/data';

// get preventivi by cliente
export async function GET(request: NextRequest) {
    try {
        // Esegui la logica lato server qui
        const res = await getNumberOfPreventivi();
        console.log("Dato restituito dall'API route getNumberOfPreventivi: ", res);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Errore nell\'API route:', error);
        return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
        }
}