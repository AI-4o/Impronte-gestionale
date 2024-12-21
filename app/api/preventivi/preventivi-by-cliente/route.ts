// pages/api/check-client.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchPreventivi } from '@/app/lib/actions/actions';

// get preventivi by cliente
export async function POST(request: NextRequest) {
    try {
        const  clienteId: string = await request.json();
        // Esegui la logica lato server qui
        const preventivi = await searchPreventivi(clienteId);
        console.log("Dato ricevuto nell'API route preventivi-by-cliente:", clienteId);
        console.log("Dato restituito dall'API route preventivi-by-cliente: ", preventivi);
        return NextResponse.json(preventivi);
    } catch (error) {
        console.error('Errore nell\'API route:', error);
        return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
    }
}