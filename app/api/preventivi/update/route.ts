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
  updatePreventivoAlClienteDescrizione,
  updatePreventivoAlClienteRow,
  deletePreventivoAlClienteRowById,
  createPreventivoAlClienteRow,
} from "@/app/lib/actions/actions";
import { Data } from "@/app/dashboard/(overview)/general-interface/general-interface.defs";
import {
  fetchAssicurazioneById,
  fetchAssicurazioniByPreventivoId,
  fetchPreventivoAlClienteByPreventivoId,
  fetchServiziAggiuntiviByPreventivoId,
  fetchServiziATerraByPreventivoId,
  fetchServizioATerraById,
  fetchVoliByPreventivoId,
  fetchVoloById,
} from "@/app/lib/data";
import { PreventivoAlCliente } from "@/app/lib/definitions";

export async function POST(request: NextRequest) {
  try {
    const d: Data = await request.json();
    console.log(
    "Dato ricevuto nell'API route di update-data-preventivo-completi:",
    d
    );
    await Promise.all([
      updatePreventivo(d.preventivo, d.cliente.id),
      updateServiziATerraPreventivo(d),
      updateServiziAggiuntiviPreventivo(d),
      updateVoliPreventivo(d),
      updateAssicurazioniPreventivo(d),
      updatePreventivoAlCliente(d),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore nell'API route:", error);
    return NextResponse.json({ success: false }, { status: 500 });
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
const updateServiziATerraPreventivo = async (d: Data): Promise<boolean> => {
  // check which ids of serviziATerra in the database do not correspond to the ids in the request
  // if they do not correspond, delete them
  const serviziATerraPrevDBResult = await fetchServiziATerraByPreventivoId(
    d.preventivo.id
  );
  if (!serviziATerraPrevDBResult.success) {
    return false;
  }
  const serviziATerraInDB = serviziATerraPrevDBResult.values?.filter(
    (s) => s.servizio_aggiuntivo === false
  );
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
        if (!feedbackServiziATerra.success) {
          return false;
        }
      } else {
        return false;
      }
    } else {
      // if it doesn't exist, create it
      const feedbackServiziATerraDBResult = await createServizioATerra(
        d.serviziATerra[i],
        d.preventivo.id,
        false
      );
      if (!feedbackServiziATerraDBResult.success) {
        return false;
      }
      if (i === d.serviziATerra.length - 1) {
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
const updateServiziAggiuntiviPreventivo = async (d: Data) => {
  // check which ids of serviziATerra in the database do not correspond to the ids in the request
  // if they do not correspond, delete them
  const serviziAggiuntiviPrevDBResult =
    await fetchServiziAggiuntiviByPreventivoId(d.preventivo.id);
  if (!serviziAggiuntiviPrevDBResult.success) {
    return false;
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
        if (!feedbackServizioAggiuntivo.success) {
          return false;
        }
        if (i === d.serviziAggiuntivi.length - 1) {
          return true;
        }
      } else {
        return false;
      }
    } else {
      // if it doesn't exist, create it
      const feedbackServizioAggiuntivoDBResult = await createServizioATerra(
        d.serviziAggiuntivi[i],
        d.preventivo.id,
        true
      );
      if (!feedbackServizioAggiuntivoDBResult.success) {
        return false;
      }
      if (i === d.serviziAggiuntivi.length - 1) {
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
const updateVoliPreventivo = async (d: Data) => {
  const voliPrevDBResult = await fetchVoliByPreventivoId(d.preventivo.id);
  if (!voliPrevDBResult.success) return false;
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
        if (!feedbackVolo.success) return false;
        if (i === d.voli.length - 1) return true;
      } else {
        return false;
      }
    } else {
      const feedbackVoloDBResult = await createVolo(d.voli[i], d.preventivo.id);
      if (!feedbackVoloDBResult.success) {
        return false;
      }
      if (i === d.voli.length - 1) return true;
    }
  }
};
/**
 * Update the assicurazioni of the preventivo as follows:
 * 1. check which ids of assicurazioni in the database do not correspond to the ids in the request: if they do not correspond, delete them
 * 2. check if the assicurazione is already in the database and if so update it, ow create it
 * @param d - The data of the preventivo passed from the FE
 * @param res - The feedback of the preventivo
 */
const updateAssicurazioniPreventivo = async (d: Data) => {
  const assicurazioniPrevDBResult = await fetchAssicurazioniByPreventivoId(
    d.preventivo.id
  );
  if (!assicurazioniPrevDBResult.success) {
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
      const assicurazioneDBResult = await fetchAssicurazioneById(
        d.assicurazioni[i].id
      );
      if (assicurazioneDBResult.success) {
        const feedbackAssicurazione = await updateAssicurazione(
          d.assicurazioni[i]
        );
        if (!feedbackAssicurazione.success) {
          return false;
        }
        return true;
      }
    } else {
      const feedbackAssicurazione = await createAssicurazione(
        d.assicurazioni[i],
        d.preventivo.id
      );
      if (!feedbackAssicurazione.success) {
        return false;
      }
      return true;
    }
  }
};

const updatePreventivoAlCliente = async (d: Data) => {
  try {
    const p = d.preventivoAlCliente;
    // aggiorna la descrizione del preventivo al cliente
    const feedbackPreventivoAlCliente =
      await updatePreventivoAlClienteDescrizione(p);
    if (!feedbackPreventivoAlCliente.success) {
      return false;
    }

    // se aggiornamento é andato a buon fine,aggiorna i preventivi al cliente row
    const preventivoClienteDBResult = (
      await fetchPreventivoAlClienteByPreventivoId(d.preventivo.id)
    ).values as PreventivoAlCliente;

    const righePrimoTipoDBIds = preventivoClienteDBResult.righePrimoTipo.map(
      (r) => r.id
    );
    const righeSecondoTipoDBIds =
      preventivoClienteDBResult.righeSecondoTipo.map((r) => r.id);
    const righeDBIds = Array.from(
      new Map(
        [...righePrimoTipoDBIds, ...righeSecondoTipoDBIds].map((id) => [id, id])
      ).keys()
    );
    // cancella le righe che non sono più presenti nel preventivo al cliente
    const righeIdsToDelete = [
      ...righePrimoTipoDBIds.filter(
        (id) =>
          !d.preventivoAlCliente.righePrimoTipo.map((r) => r.id).includes(id)
      ),
      ...righeSecondoTipoDBIds.filter(
        (id) =>
          !d.preventivoAlCliente.righeSecondoTipo.map((r) => r.id).includes(id)
      ),
    ];
    const righeIdsToUpdate = righeDBIds.filter(
      (id) => !righeIdsToDelete.includes(id)
    ); // le righe del db che esistono nella request del fe, quindi devo aggiornarle

    await Promise.all(
      righeIdsToDelete.map((id) => {
        console.log("righe delete id: ", id);
        return deletePreventivoAlClienteRowById(id);
      })
    );

    //  update le righe che esistono già nel db
    await Promise.all([
      ...p.righePrimoTipo
        .filter((r) => righeIdsToUpdate.includes(r.id))
        .map((r) => {
          console.log("righe update id: ", r.id);
          return updatePreventivoAlClienteRow(r, true, p.id);
        }),
      ...p.righeSecondoTipo
        .filter((r) => righeIdsToUpdate.includes(r.id))
        .map((r) => {
          console.log("righe update id: ", r.id);
          return updatePreventivoAlClienteRow(r, false, p.id);
        }),
    ]);

    // create le righe nuove
    await Promise.all([
      ...p.righePrimoTipo
        .filter((r) => !r.id)
        .map((r) => {
          console.log("righe create id: ", r.id);
          return createPreventivoAlClienteRow(r, true, p.id);
        }),
      ...p.righeSecondoTipo
        .filter((r) => !r.id)
        .map((r) => {
          console.log("righe create id: ", r.id);
          return createPreventivoAlClienteRow(r, false, p.id);
        }),
    ]);
    const t = await fetchPreventivoAlClienteByPreventivoId(d.preventivo.id);
    console.log(
      "preventivoAlClienteDBResult: ",
      t.values.righePrimoTipo,
      t.values.righeSecondoTipo
    );
  } catch (error) {
    console.error("Errore nell'aggiornare il preventivo al cliente: ", error);
    return false;
  }
  return true;
};
