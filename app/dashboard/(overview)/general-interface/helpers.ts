
// helper functions to compute totale and ricarico

import { z } from "zod";
import { ServizioATerraInputGroup, VoloInputGroup, AssicurazioneInputGroup } from "./general-interface.defs";

// ### servizi a terra e servizi aggiuntivi ###
export const getTotServizio = (totale: number, cambio: number, percentualeRicarico: number, numeroNotti?: number, numeroCamere?: number) => {
    if(isNaN(totale) || isNaN(cambio) || isNaN(percentualeRicarico) || isNaN(numeroNotti) || isNaN(numeroCamere) || cambio === 0) {
        return 0;
    }
    if(!numeroNotti) numeroNotti = 0;
    if(!numeroCamere) numeroCamere = 0;
    const result = (totale*numeroNotti*numeroCamere / cambio) + getRicaricoServizio(totale, cambio, percentualeRicarico, numeroNotti, numeroCamere);
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}
export const getRicaricoServizio = (totale: number, cambio: number, percentualeRicarico: number, numeroNotti?: number, numeroCamere?: number) => {
    if(isNaN(totale) || isNaN(cambio) || isNaN(percentualeRicarico) || isNaN(numeroNotti) || isNaN(numeroCamere) || cambio === 0) {
        return 0;
    }
    if(!numeroNotti) numeroNotti = 0;
    if(!numeroCamere) numeroCamere = 0;
    const result = (totale / cambio) * percentualeRicarico*numeroNotti*numeroCamere;
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}

// ### voli ###
export const getTotVolo = (totale: number, cambio: number, ricarico: number, numero: number) => {
    if (isNaN(totale) || isNaN(cambio) || isNaN(ricarico) || isNaN(numero) || cambio === 0) {
        return 0;
    }
    console.log('getTotVolo: ','totale: ', totale, 'cambio: ', cambio, 'ricarico: ', ricarico, 'numero: ', numero, 'result: ', numero * (totale / cambio + ricarico));
    
    const result = numero * (totale / cambio + ricarico);
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}

// ### assicurazioni ###
export const getTotAssicurazione = (netto: number, ricarico: number) => {
    if(isNaN(netto) || isNaN(ricarico)) {
        return 0;
    }
    const result = netto + ricarico;
    // Truncate the result to two decimal places
    return Math.trunc(result * 100) / 100;
}


export const getSommaTuttiTotEuro = (percentualeRicarico: number, serviziATerra: ServizioATerraInputGroup[], serviziAggiuntivi: ServizioATerraInputGroup[], voli: VoloInputGroup[], assicurazioni: AssicurazioneInputGroup[]) => {
    let totServiziATerra = serviziATerra.reduce((acc, servizio) => acc + getTotServizio(servizio.totale, servizio.cambio, percentualeRicarico, servizio.numero_notti, servizio.numero_camere), 0);
    let totServiziAggiuntivi = serviziAggiuntivi.reduce((acc, servizio) => acc + getTotServizio(servizio.totale, servizio.cambio, percentualeRicarico, servizio.numero_notti, servizio.numero_camere), 0);
    let totVoli = voli.reduce((acc, volo) => acc + getTotVolo(volo.totale, volo.cambio, volo.ricarico, volo.numero), 0);
    let totAssicurazioni = assicurazioni.reduce((acc, assicurazione) => acc + getTotAssicurazione(assicurazione.netto, percentualeRicarico), 0);
    // se il totale è NaN, settalo a 0
    switch(true) {
        case isNaN(totServiziATerra):
            totServiziATerra = 0;
        case isNaN(totServiziAggiuntivi):
            totServiziAggiuntivi = 0;
        case isNaN(totVoli):
            totVoli = 0;
        case isNaN(totAssicurazioni):
            totAssicurazioni = 0;
    }    
    return totServiziATerra + totServiziAggiuntivi + totVoli + totAssicurazioni;
}

export const formatDateToString = (date: Date): string => {
    if (date instanceof Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${month}${day}${year}`;
    }
    return null;
}

export const validationErrorsToString = (errors: any): string => {
    if(!errors) return '';
    return Object.keys(errors).reduce((acc, key) => acc + `${key}: ` + errors[key].join(', ') + '\n', '');
}

export const numberToExcelFormat = (numero: number): string => {
    return numero.toString().padStart(4, '0');
}

export const formatNumberItalian = (numero: number): string => {
    if (typeof numero !== 'number' || isNaN(numero)) {
        return '0,00';
    }
    return new Intl.NumberFormat('it-IT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}
