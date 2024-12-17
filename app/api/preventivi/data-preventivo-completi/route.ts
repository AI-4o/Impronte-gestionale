// pages/api/check-client.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getServiziATerraByPreventivoId,
  getServiziAggiuntiviByPreventivoId,
  getVoliByPreventivoId,
  getAssicurazioniByPreventivoId,
  getDestinazioneById,
  getFornitoreById,
} from "@/app/lib/actions/actions";
import {
  ServizioATerraInputGroup,
  VoloInputGroup,
} from "@/app/dashboard/(overview)/general-interface-create/general-interface.defs";

// get preventivi by cliente
export async function POST(request: NextRequest) {
  try {
    let res = {
      serviziATerra: [],
      serviziAggiuntivi: [],
      voli: [],
      assicurazioni: [],
    };
    const preventivoId: string = await request.json();

    // dato id preventivo vogliamo -> serviziATerra, serviziAggiuntivi, voli, assicurazioni

    const serviziATerra = await getServiziATerraByPreventivoId(preventivoId);
    const serviziAggiuntivi = await getServiziAggiuntiviByPreventivoId(
      preventivoId
    );
    const voli = await getVoliByPreventivoId(preventivoId);
    const assicurazioni = await getAssicurazioniByPreventivoId(preventivoId);

    // ### per ogni servizio a terra ottenere il servizioATerraInputGroup ###
    for (let i = 0; i < serviziATerra.rowCount; i++) {
      // se c'è la destinazione, ottienila
      let destinazione: any = "";
      if (serviziATerra.rows[i].id_destinazione) {
        const _destinazione = await getDestinazioneById(
          serviziATerra.rows[i].id_destinazione
        );
        if (_destinazione.rowCount > 0 && _destinazione.rows[0].nome) {
          destinazione = _destinazione.rows[0].nome;
        }
      }
      // se c'è il fornitore, ottienilo
      let fornitore: any = "";
      if (serviziATerra.rows[i].id_fornitore) {
        const _fornitore = await getFornitoreById(
          serviziATerra.rows[i].id_fornitore
        );
        if (_fornitore.rowCount > 0 && _fornitore.rows[0].nome) {
          fornitore = _fornitore.rows[0].nome;
        }
      }
      // create inputGroup
      const iG = new ServizioATerraInputGroup(
        i,
        destinazione,
        fornitore,
        serviziATerra.rows[i].descrizione,
        serviziATerra.rows[i].data,
        serviziATerra.rows[i].numero_notti,
        serviziATerra.rows[i].valuta,
        serviziATerra.rows[i].totale,
        serviziATerra.rows[i].cambio,
        serviziATerra.rows[i].servizio_aggiuntivo,
        serviziATerra.rows[i].id
      );
      res.serviziATerra.push(iG);
    }

    for (let i = 0; i < serviziAggiuntivi.rowCount; i++) {
      // ### per ogni servizio a terra ottenere il servizioATerraInputGroup ###

      // se c'è la destinazione, ottienila
      let destinazione: any = "";
      if (serviziATerra.rows[i].id_destinazione) {
        const _destinazione = await getDestinazioneById(
          serviziATerra.rows[i].id_destinazione
        );
        if (_destinazione.rowCount > 0 && _destinazione.rows[0].nome) {
          destinazione = _destinazione.rows[0].nome;
        }
      }
      // se c'è il fornitore, ottienilo
      let fornitore: any = "";
      if (serviziATerra.rows[i].id_fornitore) {
        const _fornitore = await getFornitoreById(
          serviziATerra.rows[i].id_fornitore
        );
        if (_fornitore.rowCount > 0 && _fornitore.rows[0].nome) {
          fornitore = _fornitore.rows[0].nome;
        }
      }
      // create inputGroup
      const iG = new ServizioATerraInputGroup(
        i,
        destinazione,
        fornitore,
        serviziATerra.rows[i].descrizione,
        serviziATerra.rows[i].data,
        serviziATerra.rows[i].numero_notti,
        serviziATerra.rows[i].valuta,
        serviziATerra.rows[i].totale,
        serviziATerra.rows[i].cambio,
        serviziATerra.rows[i].servizio_aggiuntivo,
        serviziATerra.rows[i].id
      );
      res.serviziAggiuntivi.push(iG);
    }

    for (let i = 0; i < voli.rowCount; i++) {
      const iG = new VoloInputGroup(
        i,
        voli.rows[i].fornitore,
        voli.rows[i].compagnia,
        voli.rows[i].descrizione,
        voli.rows[i].data_partenza,
        voli.rows[i].data_arrivo,
        voli.rows[i].totale,
        voli.rows[i].valuta,
        voli.rows[i].cambio,
      );
    }

    console.log("RESSSSS: ", res);

    //console.log("Dato ricevuto nell'API route:", preventivoId);
    //console.log("Dato restituito dall'API route: ", res);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Errore nell'API route:", error);
    return NextResponse.json({ error: "Errore nel server" }, { status: 500 });
  }
}
