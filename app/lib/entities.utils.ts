import {
  fetchAllDestinazioni,
  fetchAllClienti,
  fetchAllBanche,
  fetchAllFornitori,
  fetchAllPratiche,
  fetchAllPreventivi,
  fetchAllServiziATerra,
  fetchAllVoli,
  fetchAllAssicurazioni,
  fetchAllPagamentiAssicurazioni,
  fetchAllPreventiviClienti,
  fetchAllPartecipanti,
  fetchAllIncassiPartecipanti,
  fetchAllPagamentiServiziATerra,
  fetchAllPagamentiVoli,
} from "./data";
import { FetchableEntity } from "./definitions";
import {
  sampleAssicurazione,
  sampleBanca,
  sampleCliente,
  sampleDestinazione,
  sampleFornitore,
  sampleIncassoPartecipante,
  samplePagamentoAssicurazione,
  samplePagamentoServizioATerra,
  samplePagamentoVolo,
  samplePartecipante,
  samplePratica,
  samplePreventivo,
  samplePreventivoMostrareCliente,
  sampleServizioATerra,
  sampleVolo,
} from "./entities.samples";

export type EntityKey = {
  keyName: string;
  type:
    | "enum"
    | "foreign_key"
    | "telefono"
    | "email"
    | "date"
    | "number"
    | "boolean"
    | "text";
  values?: string[];
  entityName?: string;
};
/**
 * list of keys of entities that can have fixed values.
 */
export const specialKeys: { [key: string]: EntityKey[] } = {
  cliente: [
    {
      keyName: "nome",
      type: "text",
    },
    {
      keyName: "cognome",
      type: "text",
    },
    {
      keyName: "note",
      type: "text",
    },
    {
      keyName: "citta",
      type: "text",
    },
    {
      keyName: "collegato",
      type: "text",
    },
    {
      keyName: "tipo",
      type: "enum",
      values: ["PRIVATO", "AGENZIA VIAGGI", "AZIENDA"],
    },
    {
      keyName: "data_di_nascita",
      type: "date",
    },
    {
      keyName: "tel",
      type: "telefono",
    },
    {
      keyName: "email",
      type: "email",
    },
    {
      keyName: "provenienza",
      type: "enum",
      values: [
        "Passaparola",
        "Sito IWS",
        "Sito INO",
        "Telefono",
        "Email Diretta",
        "Sito ISE",
      ],
    },
  ],
  preventivo: [
    {
      keyName: "id_fornitore",
      type: "foreign_key",
      entityName: "fornitore",
    },
    {
      keyName: "id_cliente",
      type: "foreign_key",
      entityName: "cliente",
    },
    {
      keyName: "email",
      type: "email",
    },
    {
      keyName: "numero_di_telefono",
      type: "telefono",
    },
    {
      keyName: "adulti",
      type: "number",
    },
    {
      keyName: "bambini",
      type: "number",
    },
    {
      keyName: "data_partenza",
      type: "date",
    },
    {
      keyName: "data",
      type: "date",
    },
    {
      keyName: "numero_preventivo",
      type: "number",
    },
    {
      keyName: "confermato",
      type: "boolean",
    },
    {
      keyName: "stato",
      type: "enum",
      values: ["da fare", "in trattativa", "confermato", "inviato"],
    },
  ],
  servizio_a_terra: [
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "id_fornitore",
      type: "foreign_key",
      entityName: "fornitore",
    },
    {
      keyName: "id_destinazione",
      type: "foreign_key",
      entityName: "destinazione",
    },
    {
      keyName: "data",
      type: "date",
    },
    {
      keyName: "numero_notti",
      type: "number",
    },
    {
      keyName: "totale",
      type: "number",
    },
    {
      keyName: "cambio",
      type: "number",
    },
    {
      keyName: "ricarico",
      type: "number",
    },
    {
      keyName: "servizio_aggiuntivi",
      type: "boolean",
    },
  ],
  volo: [
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "id_fornitore",
      type: "foreign_key",
      entityName: "fornitore",
    },
    {
      keyName: "data_partenza",
      type: "date",
    },
    {
      keyName: "data_arrivo",
      type: "date",
    },
    {
      keyName: "totale",
      type: "number",
    },
    {
      keyName: "cambio",
      type: "number",
    },
    {
      keyName: "ricarico",
      type: "number",
    },
  ],
  assicurazione: [
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "id_fornitore",
      type: "foreign_key",
      entityName: "fornitore",
    },
    {
      keyName: "netto",
      type: "number",
    },
    {
      keyName: "ricarico",
      type: "number",
    },
  ],
  preventivo_cliente: [
    {
      keyName: "id_destinazione",
      type: "foreign_key",
      entityName: "destinazione",
    },
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "tipo",
      type: "enum",
      values: ["destinazione", "volo", "assicurazione"],
    },
    {
      keyName: "costo_individuale",
      type: "number",
    },
    {
      keyName: "importo_vendita",
      type: "number",
    },
    {
      keyName: "totale",
      type: "number",
    },
  ],
  partecipante: [
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "tot_quota",
      type: "number",
    },
  ],
  incasso_partecipante: [
    {
      keyName: "id_partecipante",
      type: "foreign_key",
      entityName: "partecipante",
    },
    {
      keyName: "data_scadenza",
      type: "date",
    },
    {
      keyName: "data_incasso",
      type: "date",
    },
    {
      keyName: "importo",
      type: "number",
    },
  ],
  pragamento_servizi_a_terra: [
    {
      keyName: "id_servizio_a_terra",
      type: "foreign_key",
      entityName: "servizio_a_terra",
    },
    {
      keyName: "id_fornitore",
      type: "foreign_key",
      entityName: "fornitore",
    },
    {
      keyName: "data_scadenza",
      type: "date",
    },
    {
      keyName: "data_incasso",
      type: "date",
    },
    {
      keyName: "importo",
      type: "number",
    },
  ],
  pagamento_voli: [
    {
      keyName: "id_volo",
      type: "foreign_key",
      entityName: "volo",
    },
    {
      keyName: "id_fornitore",
      type: "foreign_key",
      entityName: "fornitore",
    },
    {
      keyName: "data_scadenza",
      type: "date",
    },
    {
      keyName: "data_incasso",
      type: "date",
    },
    {
      keyName: "importo",
      type: "number",
    },
  ],
  pagamento_assicurazione: [
    {
      keyName: "id_fornitore",
      type: "foreign_key",
      entityName: "fornitore",
    },
    {
      keyName: "id_assicurazione",
      type: "foreign_key",
      entityName: "assicurazione",
    },
    {
      keyName: "data_scadenza",
      type: "date",
    },
    {
      keyName: "data_incasso",
      type: "date",
    },
    {
      keyName: "importo",
      type: "number",
    },
  ],
  pratica: [
    {
      keyName: "id_cliente",
      type: "foreign_key",
      entityName: "cliente",
    },
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "data_conferma",
      type: "date",
    },
    {
      keyName: "data_partenza",
      type: "date",
    },
    {
      keyName: "data_rientro",
      type: "date",
    },
    {
      keyName: "numero_passeggeri",
      type: "number",
    },
    {
      keyName: "totale",
      type: "number",
    },
  ],
};
/**
 * list of entities that can be fetched from the database
 * with their fetch callback.
 */
export const entities: FetchableEntity<any>[] = [
  {
    name: "destinazione",
    fetchCallback: fetchAllDestinazioni,
    sampleModel: sampleDestinazione,
  },
  {
    name: "cliente",
    fetchCallback: fetchAllClienti,
    sampleModel: sampleCliente,
  },
  { name: "banca", fetchCallback: fetchAllBanche, sampleModel: sampleBanca },
  {
    name: "fornitore",
    fetchCallback: fetchAllFornitori,
    sampleModel: sampleFornitore,
  },
  {
    name: "pratica",
    fetchCallback: fetchAllPratiche,
    sampleModel: samplePratica,
  },
  {
    name: "preventivo",
    fetchCallback: fetchAllPreventivi,
    sampleModel: samplePreventivo,
  },
  {
    name: "servizio_a_terra",
    fetchCallback: fetchAllServiziATerra,
    sampleModel: sampleServizioATerra,
  },
  { name: "volo", fetchCallback: fetchAllVoli, sampleModel: sampleVolo },
  {
    name: "assicurazione",
    fetchCallback: fetchAllAssicurazioni,
    sampleModel: sampleAssicurazione,
  },
  {
    name: "pagamento_assicurazione",
    fetchCallback: fetchAllPagamentiAssicurazioni,
    sampleModel: samplePagamentoAssicurazione,
  },
  {
    name: "preventivo_cliente",
    fetchCallback: fetchAllPreventiviClienti,
    sampleModel: samplePreventivoMostrareCliente,
  },
  {
    name: "partecipanti",
    fetchCallback: fetchAllPartecipanti,
    sampleModel: samplePartecipante,
  },
  {
    name: "incasso_partecipante",
    fetchCallback: fetchAllIncassiPartecipanti,
    sampleModel: sampleIncassoPartecipante,
  },
  {
    name: "pagamento_servizi_a_terra",
    fetchCallback: fetchAllPagamentiServiziATerra,
    sampleModel: samplePagamentoServizioATerra,
  },
  {
    name: "pagamento_voli",
    fetchCallback: fetchAllPagamentiVoli,
    sampleModel: samplePagamentoVolo,
  },
];
/**
 * get the dependencies entities names and the sample record of a given entity.
 * @param entityName the name of the entity.
 * @returns an object with the dependencies entities names and the sample record of the entity.
 */
export const getDependenciesAndSampleRecord = (
  entityName: (typeof entities)[number]["name"]
) => {
  // get the array of dependencies entities names
  const dependenciesNames: (typeof entities)[number]["name"][] = [];
  Object.keys(specialKeys).forEach((key) => {
    if (key == entityName) {
      // the entity that corresponds to the entityName
      const entityKeys = specialKeys[key];
      entityKeys.forEach((entityKey) => {
        if (entityKey.type == "foreign_key") {
          dependenciesNames.push(entityKey.entityName);
        }
      });
    }
  });
  const entity = entities.find(e => e.name == entityName);
  return {dependenciesNames: dependenciesNames, sampleRecord: entity?.sampleModel};
};
