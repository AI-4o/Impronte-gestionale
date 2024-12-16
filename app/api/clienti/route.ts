// pages/api/check-client.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchClienti } from '@/app/lib/actions/actions';


export async function POST(request: NextRequest) {
    try {
        const  cliente = await request.json();
        // Esegui la logica lato server qui
        const isNew = await searchClienti(cliente);
        console.log("Dato ricevuto nell'API route:", cliente);
        console.log("Dato restituito dall'API route: ", isNew);
        return NextResponse.json(isNew);
    } catch (error) {
        console.error('Errore nell\'API route:', error);
        return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
    }
}