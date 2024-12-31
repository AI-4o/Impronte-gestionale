import { NextRequest, NextResponse } from "next/server";
import {
  updatePreventivo,
  updateServiziATerra,
  updateAssicurazioni as updateAssicurazione,
  updateVoli as updateVolo,
  createServizioATerra,
  createVolo,
  createAssicurazione,
  deleteServizioATerraById,
  deleteVoloById,
  deleteAssicurazioneById,
  DBResult,
} from "@/app/lib/actions/actions";
import {
  AssicurazioneInputGroup,
  Data,
  PreventivoInputGroup,
  ServizioATerraInputGroup,
  VoloInputGroup,
} from "@/app/dashboard/(overview)/general-interface/general-interface.defs";
import {
  fetchAssicurazioneById,
  fetchAssicurazioniByPreventivoId,
  fetchServiziAggiuntiviByPreventivoId,
  fetchServiziATerraByPreventivoId,
  fetchServizioATerraById,
  fetchVoliByPreventivoId,
  fetchVoloById,
} from "@/app/lib/data";
import { validationErrorsToString } from "@/app/dashboard/(overview)/general-interface/helpers";


export type CompleteUpdatePreventivoFeedback = {
  feedbackPreventivo: DBResult<PreventivoInputGroup> & {message?: string};
  feedbackServiziATerra: DBResult<ServizioATerraInputGroup[]> & {message?: string};
  feedbackServiziAggiuntivi: DBResult<ServizioATerraInputGroup[]> & {message?: string};
  feedbackVoli: DBResult<VoloInputGroup[]> & {message?: string};
  feedbackAssicurazioni: DBResult<AssicurazioneInputGroup[]> & {message?: string};
};
export async function POST(request: NextRequest) {
  try {
    let res: CompleteUpdatePreventivoFeedback = {
      feedbackPreventivo: {
        success: false,
        errorsMessage: '',
        errors: undefined,
        values: {},
        message: ''
      },
      feedbackServiziATerra: {
        success: false,
        errorsMessage: 'servizi a terra non aggiornati',
        errors: undefined,
        values: [],
        message: ''
      },
      feedbackServiziAggiuntivi: {
        success: false,
        errorsMessage: 'servizi aggiuntivi non aggiornati',
        errors: undefined,
        values: [],
        message: ''
      },
      feedbackVoli: {
        success: false,
        errorsMessage: 'voli non aggiornati',
        errors: undefined,
        values: [],
      },
      feedbackAssicurazioni: {
        success: false,
        errorsMessage: 'assicurazioni non aggiornate',
        errors: undefined,
        values: [],
        message: ''
      },
    };
    const d: Data = await request.json();
    console.log(
      "Dato ricevuto nell'API route di update-data-preventivo-completi:",
      d
    );
    const feedbackPreventivo = await updatePreventivo(
      d.preventivo,
      d.cliente.id
    );
    res.feedbackPreventivo = feedbackPreventivo;

    if(!feedbackPreventivo.success) {
      res.feedbackPreventivo.errorsMessage = "Errore nell'aggiornare il preventivo: " + feedbackPreventivo.errorsMessage;
      return NextResponse.json(res);
    }
     const resServiziATerra = await updateServiziATerraPreventivo(d, res);
     if(!resServiziATerra) {
      console.log("Errore nell'aggiornare i servizi a terra: ", res.feedbackServiziATerra.errorsMessage);
      
      return NextResponse.json(res);
     }
     const resServiziAggiuntivi = await updateServiziAggiuntiviPreventivo(d, res);
     if(!resServiziAggiuntivi) {
      console.log("Errore nell'aggiornare i servizi aggiuntivi: ", res.feedbackServiziAggiuntivi.errorsMessage);  
      return NextResponse.json(res);
     }
     const resVoli = await updateVoliPreventivo(d, res);
     if(!resVoli) {
      console.log("Errore nell'aggiornare i voli: ", res.feedbackVoli.errorsMessage);
      return NextResponse.json(res);
     }
     const resAssicurazioni = await updateAssicurazioniPreventivo(d, res);
     if(!resAssicurazioni) {
      console.log("Errore nell'aggiornare le assicurazioni: ", res.feedbackAssicurazioni.errorsMessage);
      return NextResponse.json(res);
     }
    console.log(
      "Dato restituito dall'API route di update-data-preventivo-completi: ",
      res
    );
    return NextResponse.json(res);
  } catch (error) {
    console.error("Errore nell'API route:", error);
    return NextResponse.json({ error: "Errore nel server" }, { status: 500 });
  }
}

/**
 * Update the serviziATerra of the preventivo as follows:
 * 1. delete servizi a terra: 
 * check which ids of serviziATerra in the database do not correspond 
 * to the ids in the request: if they do not correspond, delete them.
 * 2. create/update servizi a terra: 
 * check if the servizioATerra is already in the database and if so update it, ow create it.
 * @param d - The data of the preventivo
 * @param res - The feedback of the preventivo
 */
const updateServiziATerraPreventivo = async (
  d: Data,
  res: CompleteUpdatePreventivoFeedback
): Promise<boolean> => {
  if(d.serviziATerra.length === 0) { // caso no servizi a terra passati dal FE
    res.feedbackServiziATerra.success = true;
    res.feedbackServiziATerra.message = 'no servizi a terra passati dal FE, nulla da aggiornare';
    return true;
  }
  // check which ids of serviziATerra in the database do not correspond to the ids in the request
  // if they do not correspond, delete them

  const serviziATerraPrevDBResult = await fetchServiziATerraByPreventivoId(
    d.preventivo.id
  );
  if (!serviziATerraPrevDBResult.success) {
    res.feedbackServiziATerra.success = false;
    res.feedbackServiziATerra.errorsMessage =
      "Errore nel recuperare i servizi a terra del preventivo: " +
      serviziATerraPrevDBResult.errorsMessage;
    return false;
  }
  const serviziATerraInDB = serviziATerraPrevDBResult.values?.filter((s) => s.servizio_aggiuntivo === false);
  const idsServiziATerraInDB = serviziATerraInDB.map(
    (servizioATerra) => servizioATerra.id
  );
  const idsServiziATerraInRequest = d.serviziATerra.map(
    (servizioATerra) => servizioATerra.id
  );
  const idsToDelete = idsServiziATerraInDB.filter(
    (id) => !idsServiziATerraInRequest.includes(id)
  );
  for (const id of idsToDelete) {
    await deleteServizioATerraById(id);
  }
  // check if the servizioATerra is already in the database and if so update it, ow create it
  for (let i = 0; i < d.serviziATerra.length; i++) {
    if (d.serviziATerra[i].id) {
      const servizioATerraDBResult = await fetchServizioATerraById(
        d.serviziATerra[i].id
      );
      if (servizioATerraDBResult.success) {
        // if it exists, update it
        const feedbackServiziATerra = await updateServiziATerra(
          d.serviziATerra[i]
        );
        if(!feedbackServiziATerra.success) {
          res.feedbackServiziATerra.success = false;
          res.feedbackServiziATerra.errorsMessage = "Errore nell'aggiornare il servizio a terra: " + feedbackServiziATerra.errorsMessage;
          if(feedbackServiziATerra.errors) {
            res.feedbackServiziATerra.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackServiziATerra.errors);
          }
          return false;
        }
        res.feedbackServiziATerra.values[i] = feedbackServiziATerra.values;
        if(i === d.serviziATerra.length - 1) {
          res.feedbackServiziATerra.success = true;
          res.feedbackServiziATerra.errorsMessage = '';
          return true;
        }
      }
      else {
        res.feedbackServiziATerra.success = false;
        res.feedbackServiziATerra.errorsMessage = "Errore nel verificare se il servizio a terra esiste: " 
        + servizioATerraDBResult.errorsMessage
        + "--- id servizio a terra: " + d.serviziATerra[i].id
        if(servizioATerraDBResult.errors) {
          res.feedbackServiziATerra.errorsMessage += "--- validation errors: " + validationErrorsToString(servizioATerraDBResult.errors);
        }
        return false;
      }
    } else {
      // if it doesn't exist, create it
      const feedbackServiziATerraDBResult = await createServizioATerra(
        d.serviziATerra[i],
        d.preventivo.id,
        false
      );
      if(!feedbackServiziATerraDBResult.success) {
        res.feedbackServiziATerra.success = false;
        res.feedbackServiziATerra.errorsMessage = "Errore nel creare il servizio a terra: " + feedbackServiziATerraDBResult.errorsMessage;
        if(feedbackServiziATerraDBResult.errors) {
          res.feedbackServiziATerra.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackServiziATerraDBResult.errors);
        }
        return false;
      }
      res.feedbackServiziATerra.values[i] = feedbackServiziATerraDBResult.values;
      if(i === d.serviziATerra.length - 1) {
        res.feedbackServiziATerra.success = true;
        res.feedbackServiziATerra.errorsMessage = '';
        return true;
      }
    }
  }
};
/**
 * Update the serviziAggiuntivi of the preventivo as follows:
 * 1. check which ids of serviziAggiuntivi in the database do not correspond to the ids in the request: if they do not correspond, delete them
 * 2. check if the servizioAggiuntivo is already in the database and if so update it, ow create it
 * @param d - The data of the preventivo
 * @param res - The feedback of the preventivo
 */
const updateServiziAggiuntiviPreventivo = async (
  d: Data,
  res: CompleteUpdatePreventivoFeedback
) => {
  if(d.serviziAggiuntivi.length === 0) { // caso no servizi aggiuntivi passati dal FE
    res.feedbackServiziAggiuntivi.success = true;
    res.feedbackServiziAggiuntivi.message = 'no servizi aggiuntivi passati dal FE, nulla da aggiornare';
    return true;
  }
  // check which ids of serviziATerra in the database do not correspond to the ids in the request
  // if they do not correspond, delete them
  const serviziAggiuntiviPrevDBResult = await fetchServiziAggiuntiviByPreventivoId(d.preventivo.id);
  if(!serviziAggiuntiviPrevDBResult.success) {
    res.feedbackPreventivo.success = false;
    res.feedbackPreventivo.errorsMessage = "Errore nel recuperare i servizi aggiuntivi del preventivo: " + serviziAggiuntiviPrevDBResult.errorsMessage;
    if(serviziAggiuntiviPrevDBResult.errors) {
      res.feedbackPreventivo.errorsMessage += "--- validation errors: " + validationErrorsToString(serviziAggiuntiviPrevDBResult.errors);
    }
    return;
  }
  const serviziAggiuntiviPreventivoInDB = serviziAggiuntiviPrevDBResult.values;
  const idsServiziAggiuntiviInDB = serviziAggiuntiviPreventivoInDB.map(
    (servizioAggiuntivo) => servizioAggiuntivo.id
  );
  const idsServiziAggiuntiviInRequest = d.serviziAggiuntivi.map(
    (servizioAggiuntivo) => servizioAggiuntivo.id
  );
  const idsToDelete = idsServiziAggiuntiviInDB.filter(
    (id) => !idsServiziAggiuntiviInRequest.includes(id)
  );
  for (const id of idsToDelete) {
    await deleteServizioATerraById(id);
  }
  // check if the servizioATerra is already in the database and if so update it, ow create it
  for (let i = 0; i < d.serviziAggiuntivi.length; i++) {
    if (d.serviziAggiuntivi[i].id) {
      const servizioAggiuntivoDBResult = await fetchServizioATerraById(
        d.serviziAggiuntivi[i].id
      );
      if (servizioAggiuntivoDBResult.success) {
        // if it exists, update it
        const feedbackServizioAggiuntivo = await updateServiziATerra(
          d.serviziAggiuntivi[i]
        );
        if(!feedbackServizioAggiuntivo.success) {
          res.feedbackServiziAggiuntivi.success = false;
          res.feedbackServiziAggiuntivi.errorsMessage = "Errore nell'aggiornare il servizio aggiuntivo: " + feedbackServizioAggiuntivo.errorsMessage;
          if(feedbackServizioAggiuntivo.errors) {
            res.feedbackServiziAggiuntivi.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackServizioAggiuntivo.errors);
          }
          return false;
        }
        res.feedbackServiziAggiuntivi.values[i] = feedbackServizioAggiuntivo.values;
        if(i === d.serviziAggiuntivi.length - 1) {
          res.feedbackServiziAggiuntivi.success = true;
          res.feedbackServiziAggiuntivi.errorsMessage = '';
          return true;
        }
      }
      else {
        res.feedbackServiziAggiuntivi.success = false;
        res.feedbackServiziAggiuntivi.errorsMessage = "Errore nel verificare se il servizio aggiuntivo esiste: " 
        + servizioAggiuntivoDBResult.errorsMessage
        + "--- id servizio aggiuntivo: " + d.serviziAggiuntivi[i].id;
        return false;
      }
    } else {
      // if it doesn't exist, create it
      const feedbackServizioAggiuntivoDBResult = await createServizioATerra(
        d.serviziAggiuntivi[i],
        d.preventivo.id,
        true
      );
      if(!feedbackServizioAggiuntivoDBResult.success) {
        res.feedbackServiziAggiuntivi.success = false;
        res.feedbackServiziAggiuntivi.errorsMessage = "Errore nel creare il servizio aggiuntivo: " + feedbackServizioAggiuntivoDBResult.errorsMessage;
        if(feedbackServizioAggiuntivoDBResult.errors) {
          res.feedbackServiziAggiuntivi.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackServizioAggiuntivoDBResult.errors);
        }
        return false;
      }
      res.feedbackServiziAggiuntivi.values[i] = feedbackServizioAggiuntivoDBResult.values;
      if(i === d.serviziAggiuntivi.length - 1) {
        res.feedbackServiziAggiuntivi.success = true;
        res.feedbackServiziAggiuntivi.errorsMessage = '';
        return true;
      }
    }
  }
};
/**
 * Update the voli of the preventivo as follows:
 * 1. check which ids of voli in the database do not correspond to the ids in the request: if they do not correspond, delete them
 * 2. check if the volo is already in the database and if so update it, ow create it
 * @param d - The data of the preventivo
 * @param res - The feedback of the preventivo
 */
const updateVoliPreventivo = async (
  d: Data,
  res: CompleteUpdatePreventivoFeedback
) => {
  if(d.voli.length === 0) { // caso no voli passati dal FE
    res.feedbackVoli.success = true;
    res.feedbackVoli.message = 'no voli passati dal FE, nulla da aggiornare';
    return true;
  }
  const voliPrevDBResult = await fetchVoliByPreventivoId(d.preventivo.id);
  if(!voliPrevDBResult.success) {
    res.feedbackVoli.success = false;
    res.feedbackVoli.errorsMessage = "Errore nel recuperare i voli del preventivo: " + voliPrevDBResult.errorsMessage;
    if(voliPrevDBResult.errors) {
      res.feedbackVoli.errorsMessage += "--- validation errors: " + validationErrorsToString(voliPrevDBResult.errors);
    }
    return false;
  }
  const idsVoliInDB = voliPrevDBResult.values.map((volo) => volo.id);
  const idsVoliInRequest = d.voli.map((volo) => volo.id);
  const idsToDelete = idsVoliInDB.filter(
    (id) => !idsVoliInRequest.includes(id)
  );
  for (const id of idsToDelete) {
    await deleteVoloById(id);
  }
  for (let i = 0; i < d.voli.length; i++) {
    if (d.voli[i].id) {
      const voloDBResult = await fetchVoloById(d.voli[i].id);
      if (voloDBResult.success) {
        const feedbackVolo = await updateVolo(d.voli[i]);
        if(!feedbackVolo.success) {
          res.feedbackVoli.success = false;
          res.feedbackVoli.errorsMessage = "Errore nell'aggiornare il volo: " + feedbackVolo.errorsMessage;
          if(feedbackVolo.errors) {
            res.feedbackVoli.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackVolo.errors);
          }
          return false;
        }
        res.feedbackVoli.values[i] = feedbackVolo.values;
        if(i === d.voli.length - 1) {
          res.feedbackVoli.success = true;
          res.feedbackVoli.errorsMessage = '';
          return true;
        }
      }
      else {
        res.feedbackVoli.success = false;
        res.feedbackVoli.errorsMessage = "Errore nel verificare se il volo esiste: " 
        + voloDBResult.errorsMessage
        + "--- id volo: " + d.voli[i].id;
        if(voloDBResult.errors) {
          res.feedbackVoli.errorsMessage += "--- validation errors: " + validationErrorsToString(voloDBResult.errors);
        }
        return false;
      }
    } else {
      const feedbackVoloDBResult = await createVolo(d.voli[i], d.preventivo.id);
      if(!feedbackVoloDBResult.success) {
        res.feedbackVoli.success = false;
        res.feedbackVoli.errorsMessage = "Errore nel creare il volo: " + feedbackVoloDBResult.errorsMessage;
        if(feedbackVoloDBResult.errors) {
          res.feedbackVoli.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackVoloDBResult.errors);
        }
        return false;
      }
      res.feedbackVoli.values[i] = feedbackVoloDBResult.values;
      if(i === d.voli.length - 1) {
        res.feedbackVoli.success = true;
        res.feedbackVoli.errorsMessage = '';
        return true;
      }
    }
  }
};
/**
 * Update the assicurazioni of the preventivo as follows:
 * 1. check which ids of assicurazioni in the database do not correspond to the ids in the request: if they do not correspond, delete them
 * 2. check if the assicurazione is already in the database and if so update it, ow create it
 * @param d - The data of the preventivo
 * @param res - The feedback of the preventivo
 */
const updateAssicurazioniPreventivo = async (
  d: Data,
  res: CompleteUpdatePreventivoFeedback
) => {
  if(d.assicurazioni.length === 0) { // caso no assicurazioni passate dal FE
    res.feedbackAssicurazioni.success = true;
    res.feedbackAssicurazioni.message = 'no assicurazioni passate dal FE, nulla da aggiornare';
    return true;
  }
  const assicurazioniPrevDBResult = await fetchAssicurazioniByPreventivoId(
    d.preventivo.id
  );
  if(!assicurazioniPrevDBResult.success) {
    res.feedbackAssicurazioni.success = false;
    res.feedbackAssicurazioni.errorsMessage = "Errore nel recuperare le assicurazioni del preventivo: " + assicurazioniPrevDBResult.errorsMessage;
    if(assicurazioniPrevDBResult.errors) {
      res.feedbackAssicurazioni.errorsMessage += "--- validation errors: " + validationErrorsToString(assicurazioniPrevDBResult.errors);
    }
    return false;
  }
  const idsAssicurazioniInDB = assicurazioniPrevDBResult.values.map(
    (assicurazione) => assicurazione.id
  );
  const idsAssicurazioniInRequest = d.assicurazioni.map(
    (assicurazione) => assicurazione.id
  );
  const idsToDelete = idsAssicurazioniInDB.filter(
    (id) => !idsAssicurazioniInRequest.includes(id)
  );
  for (const id of idsToDelete) {
    await deleteAssicurazioneById(id);
  }
  for (let i = 0; i < d.assicurazioni.length; i++) {
    if (d.assicurazioni[i].id) {
      const assicurazioneDBResult = await fetchAssicurazioneById(d.assicurazioni[i].id);
      if (assicurazioneDBResult.success) {
        const feedbackAssicurazione = await updateAssicurazione(
          d.assicurazioni[i]
        );
        if(!feedbackAssicurazione.success) {
          res.feedbackAssicurazioni.success = false;
          res.feedbackAssicurazioni.errorsMessage = "Errore nell'aggiornare l'assicurazione: " + feedbackAssicurazione.errorsMessage;
          if(feedbackAssicurazione.errors) {
            res.feedbackAssicurazioni.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackAssicurazione.errors);
          }
          return false;
        }
        res.feedbackAssicurazioni.values[i] = feedbackAssicurazione.values;
        if(i === d.assicurazioni.length - 1) {
          res.feedbackAssicurazioni.success = true;
          res.feedbackAssicurazioni.errorsMessage = '';
          return true;
        }
      }
    } else {
      const feedbackAssicurazione = await createAssicurazione(
        d.assicurazioni[i],
        d.preventivo.id
      );
      if(!feedbackAssicurazione.success) {
        res.feedbackAssicurazioni.success = false;
        res.feedbackAssicurazioni.errorsMessage = "Errore nel creare l'assicurazione: " + feedbackAssicurazione.errorsMessage;
        if(feedbackAssicurazione.errors) {
          res.feedbackAssicurazioni.errorsMessage += "--- validation errors: " + validationErrorsToString(feedbackAssicurazione.errors);
        }
        return false;
      }
      res.feedbackAssicurazioni.values[i] = feedbackAssicurazione.values;
      if(i === d.assicurazioni.length - 1) {
        res.feedbackAssicurazioni.success = true;
        res.feedbackAssicurazioni.errorsMessage = '';
        return true;
      }
    }
  }
};
