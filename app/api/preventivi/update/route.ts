import { NextRequest, NextResponse } from "next/server";
import {
  updatePreventivo,
  updateServiziATerra,
  updateAssicurazioni,
  updateVoli,
} from "@/app/lib/actions/actions";
import { Data, SUCCESSMESSAGE } from "@/app/dashboard/(overview)/general-interface-create/general-interface.defs";

type EntityFeedback = {
  message: string,
  errorsMessage?: string,
  typeOfEntity: string,
  idOfEntity: string,
  errors?: { [key: string]: string[] },
}
export type CompleteUpdatePreventivoFeedback = {
  feedbackPreventivo: EntityFeedback,
  feedbackServiziATerra: EntityFeedback[],
  feedbackServiziAggiuntivi: EntityFeedback[],
  feedbackVoli: EntityFeedback[],
  feedbackAssicurazioni: EntityFeedback[],
}
export async function POST(request: NextRequest) {
  
  try {
    let res: CompleteUpdatePreventivoFeedback = {
      feedbackPreventivo: {
        message: SUCCESSMESSAGE,
        typeOfEntity: '',
        errorsMessage: '',
        idOfEntity: '',
        errors: {},
      },
      feedbackServiziATerra: [
        {
          message: SUCCESSMESSAGE,
          typeOfEntity: '',
          errorsMessage: '',
          idOfEntity: '',
          errors: {},
        }
      ],
      feedbackServiziAggiuntivi: [
        {
          message: SUCCESSMESSAGE,
          typeOfEntity: '',
          errorsMessage: '',
          idOfEntity: '',
          errors: {},
        }
      ],
      feedbackVoli: [
        {
          message: SUCCESSMESSAGE,
          typeOfEntity: '',
          errorsMessage: '',
          idOfEntity: '',
          errors: {},
        }
      ],
      feedbackAssicurazioni: [
        {
          message: SUCCESSMESSAGE,
          typeOfEntity: '',
          errorsMessage: '',
          idOfEntity: '',
          errors: {},
        }
      ]
    };
    const d: Data = await request.json();
    console.log("Dato ricevuto nell'API route di update-data-preventivo-completi:", d);
    const feedbackPreventivo = await updatePreventivo(d.preventivo, d.cliente.id);
    res.feedbackPreventivo = {...feedbackPreventivo, typeOfEntity: 'preventivo', idOfEntity: d.preventivo.id};

    for(let i = 0; i < d.serviziATerra.length; i++) {
      const feedbackServiziATerra = await updateServiziATerra(d.serviziATerra[i], d.cliente.id);
      res.feedbackServiziATerra[i] = {...feedbackServiziATerra, typeOfEntity: 'serviziATerra', idOfEntity: d.serviziATerra[i].id};
    }
    for(let i = 0; i < d.serviziAggiuntivi.length; i++) {
      const feedbackServiziAggiuntivi = await updateServiziATerra(d.serviziAggiuntivi[i], d.cliente.id);
      res.feedbackServiziAggiuntivi[i]= {...feedbackServiziAggiuntivi, typeOfEntity: 'serviziAggiuntivi', idOfEntity: d.serviziAggiuntivi[i].id};
    }
    for(let i = 0; i < d.voli.length; i++) {
      const feedbackVoli = await updateVoli(d.voli[i], d.cliente.id);
      res.feedbackVoli[i] = {...feedbackVoli, typeOfEntity: 'voli', idOfEntity: d.voli[i].id};
    }
    for(let i = 0; i < d.assicurazioni.length; i++) {
      const feedbackAssicurazioni = await updateAssicurazioni(d.assicurazioni[i], d.cliente.id);
      res.feedbackAssicurazioni[i] = {...feedbackAssicurazioni, typeOfEntity: 'assicurazioni', idOfEntity: d.assicurazioni[i].id};
    }
    console.log("Dato restituito dall'API route di update-data-preventivo-completi: ", res);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Errore nell'API route:", error);
    return NextResponse.json({ error: "Errore nel server" }, { status: 500 });
  }
}