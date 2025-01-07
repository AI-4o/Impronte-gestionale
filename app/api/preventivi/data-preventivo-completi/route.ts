import { NextRequest, NextResponse } from "next/server";

import {
  AssicurazioneInputGroup,
  Data,
  PreventivoInputGroup,
  ServizioATerraInputGroup,
  VoloInputGroup,
} from "@/app/dashboard/(overview)/general-interface/general-interface.defs";
import { DBResult, getDestinazioneById, getFornitoreById } from "@/app/lib/actions/actions";
import { fetchServiziATerraByPreventivoId, fetchServiziAggiuntiviByPreventivoId, fetchVoliByPreventivoId, fetchAssicurazioniByPreventivoId } from "@/app/lib/data";

export async function POST(request: NextRequest) {
    let res: DBResult<Data> = {
      values: {
        preventivo: undefined,
        serviziATerra: [],
        serviziAggiuntivi: [],
        voli: [],
        assicurazioni: [],
      },
      success: false,
      errors: {},
      errorsMessage: ""
    };
    const p: PreventivoInputGroup = await request.json();
    console.log("Dato ricevuto nell'API route di get-data-preventivo-completi:", p);
    const preventivoId = p.id;

    // dato id preventivo vogliamo -> serviziATerra, serviziAggiuntivi, voli, assicurazioni

    const serviziATerra = await fetchServiziATerraByPreventivoId(preventivoId);
    const serviziAggiuntivi = await fetchServiziAggiuntiviByPreventivoId(
      preventivoId
    );
    const voli = await fetchVoliByPreventivoId(preventivoId);
    const assicurazioni = await fetchAssicurazioniByPreventivoId(preventivoId);

    // if any of the fetching fails, return the error
    if(!serviziATerra.success || !serviziAggiuntivi.success || !voli.success || !assicurazioni.success) {
      [serviziATerra, serviziAggiuntivi, voli, assicurazioni].forEach(s => {
        if(!s.success) {
          res.errorsMessage += s.errorsMessage + "\n";
        }
      });
      return NextResponse.json(res);
    }
    else { // if all fetching succeed

    // ### trasformare dati nei rispettivi inputGroups ###
    console.log('serviziATerra: ', serviziATerra);
    console.log('serviziAggiuntivi: ', serviziAggiuntivi);
    console.log('voli: ', voli);
    console.log('assicurazioni: ', assicurazioni);
    const serviziATerraInputGroup = await getServiziATerraInputGroup(serviziATerra.values as any[]);
    const serviziAggiuntiviInputGroup = await getServiziATerraInputGroup(serviziAggiuntivi.values as any[]);
    const voliInputGroup = await getVoliInputGroup(voli.values as any[]);
    const assicurazioniInputGroup = await getAssicurazioniInputGroup(assicurazioni.values as any[]);

    res.values.preventivo = p;
    res.values.serviziATerra = serviziATerraInputGroup;
    res.values.serviziAggiuntivi = serviziAggiuntiviInputGroup;
    res.values.voli = voliInputGroup;
    res.values.assicurazioni = assicurazioniInputGroup;
    res.success = true;
    console.log("Dato restituito dall'API route di get-data-preventivo-completi: ", res);
    return NextResponse.json(res);
    }
}

const getServiziATerraInputGroup = async (serviziATerra: any[]): Promise<ServizioATerraInputGroup[]> => {
  const res: ServizioATerraInputGroup[] = [];
  for (let i = 0; i < serviziATerra.length; i++) {
    // se c'è la destinazione, ottienila
    let destinazione: any = "";
    const id_destinazione = serviziATerra[i]?.id_destinazione;
    if (id_destinazione) {
      const _destinazione = await getDestinazioneById(id_destinazione);
      if (_destinazione.success) {
        destinazione = _destinazione.values?.nome;
      }
    }
    // se c'è il fornitore, ottienilo
    let fornitore: any = "";
    const id_fornitore = serviziATerra[i]?.id_fornitore;
    if (id_fornitore) {
      const _fornitore = await getFornitoreById(id_fornitore);
      if (_fornitore.success) {
        fornitore = _fornitore?.values.nome;
      }
    }
    // create inputGroup
    const iG = new ServizioATerraInputGroup(
      i,
      destinazione,
      fornitore,
      serviziATerra[i]?.descrizione,
      serviziATerra[i]?.data,
      serviziATerra[i]?.numero_notti,
      serviziATerra[i]?.numero_camere,
      serviziATerra[i]?.valuta,
      serviziATerra[i]?.totale,
      serviziATerra[i]?.cambio,
      serviziATerra[i]?.servizio_aggiuntivo,
      serviziATerra[i]?.id
    );
    res.push(iG);
  }
  return res;
}

const getVoliInputGroup = async (voli: any[]): Promise<VoloInputGroup[]> => {
    const res: VoloInputGroup[] = [];
    for (let i = 0; i < voli.length; i++) {
      // se c'è il fornitore, ottienilo
      let fornitore: any = "";
      const id_fornitore = voli[i]?.id_fornitore;
      if (id_fornitore) {
        const _fornitore = await getFornitoreById(id_fornitore);
        if (_fornitore.success) {
          fornitore = _fornitore.values?.nome;
        }
      }
      const iG = new VoloInputGroup(
        i,
        fornitore,
        voli[i]?.compagnia,
        voli[i]?.descrizione,
        voli[i]?.data_partenza,
        voli[i]?.data_arrivo,
        voli[i]?.totale,
        voli[i]?.ricarico,
        voli[i]?.numero,
        voli[i]?.valuta,
        voli[i]?.cambio,
        voli[i]?.id
    );
    res.push(iG);
  }
  return res;
}

const getAssicurazioniInputGroup = async (assicurazioni: any[]): Promise<AssicurazioneInputGroup[]> => {
  const res: AssicurazioneInputGroup[] = [];
  for (let i = 0; i < assicurazioni.length; i++) {
    // se c'è il fornitore, ottienilo
    let fornitore: any = "";
    const id_fornitore = assicurazioni[i]?.id_fornitore;
    if (id_fornitore) {
      const _fornitore = await getFornitoreById(id_fornitore);
      if (_fornitore.success) {
        fornitore = _fornitore.values.nome;
      }
    }
    const iG = new AssicurazioneInputGroup(
      i, 
      fornitore, 
      assicurazioni[i]?.assicurazione, 
      assicurazioni[i]?.netto, 
      assicurazioni[i]?.ricarico,
      assicurazioni[i]?.id
    );
    res.push(iG);
  }
  return res;
}