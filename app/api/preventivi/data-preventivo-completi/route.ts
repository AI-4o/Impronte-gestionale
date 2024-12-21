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
  AssicurazioneInputGroup,
  Data,
  Feedback,
  PreventivoInputGroup,
  ServizioATerraInputGroup,
  VoloInputGroup,
} from "@/app/dashboard/(overview)/general-interface-create/general-interface.defs";

export async function POST(request: NextRequest) {
  
  try {
    let res: Data & {feedback?: Feedback} = {
      preventivo: undefined,
      serviziATerra: [],
      serviziAggiuntivi: [],
      voli: [],
      assicurazioni: [],
      feedback: undefined,
    };
    const p: PreventivoInputGroup = await request.json();
    console.log("Dato ricevuto nell'API route di get-data-preventivo-completi:", p);
    const preventivoId = p.id;

    // dato id preventivo vogliamo -> serviziATerra, serviziAggiuntivi, voli, assicurazioni

    const serviziATerra = await getServiziATerraByPreventivoId(preventivoId);
    const serviziAggiuntivi = await getServiziAggiuntiviByPreventivoId(
      preventivoId
    );
    const voli = await getVoliByPreventivoId(preventivoId);
    const assicurazioni = await getAssicurazioniByPreventivoId(preventivoId);

    // ### trasformare dati nei rispettivi inputGroups ###
    const serviziATerraInputGroup = await getServiziATerraInputGroup(serviziATerra);
    const serviziAggiuntiviInputGroup = await getServiziATerraInputGroup(serviziAggiuntivi);
    const voliInputGroup = await getVoliInputGroup(voli);
    const assicurazioniInputGroup = await getAssicurazioniInputGroup(assicurazioni);

    res.preventivo = p;
    res.serviziATerra = serviziATerraInputGroup;
    res.serviziAggiuntivi = serviziAggiuntiviInputGroup;
    res.voli = voliInputGroup;
    res.assicurazioni = assicurazioniInputGroup;
    console.log("Dato restituito dall'API route di get-data-preventivo-completi: ", res);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Errore nell'API route:", error);
    return NextResponse.json({ error: "Errore nel server" }, { status: 500 });
  }
}

const getServiziATerraInputGroup = async (serviziATerra: any): Promise<ServizioATerraInputGroup[]> => {
  const res: ServizioATerraInputGroup[] = [];
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
    res.push(iG);
  }
  return res;
}

const getVoliInputGroup = async (voli: any): Promise<VoloInputGroup[]> => {
    const res: VoloInputGroup[] = [];
    for (let i = 0; i < voli.rowCount; i++) {
      // se c'è il fornitore, ottienilo
      let fornitore: any = "";
      if (voli.rows[i].id_fornitore) {
        const _fornitore = await getFornitoreById(voli.rows[i].id_fornitore);
        if (_fornitore.rowCount > 0 && _fornitore.rows[0].nome) {
          fornitore = _fornitore.rows[0].nome;
        }
      }
      const iG = new VoloInputGroup(
        i,
        fornitore,
        voli.rows[i].compagnia,
        voli.rows[i].descrizione,
        voli.rows[i].data_partenza,
        voli.rows[i].data_arrivo,
        voli.rows[i].totale,
        voli.rows[i].valuta,
        voli.rows[i].cambio,
      voli.rows[i].id
    );
    res.push(iG);
  }
  return res;
}

const getAssicurazioniInputGroup = async (assicurazioni: any): Promise<AssicurazioneInputGroup[]> => {
  const res: AssicurazioneInputGroup[] = [];
  for (let i = 0; i < assicurazioni.rowCount; i++) {
    // se c'è il fornitore, ottienilo
    let fornitore: any = "";
    if (assicurazioni.rows[i].id_fornitore) {
      const _fornitore = await getFornitoreById(assicurazioni.rows[i].id_fornitore);
      if (_fornitore.rowCount > 0 && _fornitore.rows[0].nome) {
        fornitore = _fornitore.rows[0].nome;
      }
    }
    const iG = new AssicurazioneInputGroup(
      i, 
      fornitore, 
      assicurazioni.rows[i].assicurazione, 
      assicurazioni.rows[i].netto, 
      assicurazioni.rows[i].id
    );
    res.push(iG);
  }
  return res;
}