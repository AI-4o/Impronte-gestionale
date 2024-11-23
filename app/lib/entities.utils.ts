import { valuteArray } from "./actions/entity-zod-schemas";
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

/**
 * Type resuming all the infos on a key of an entity, it is an object with fields:
 * 1. keyName -> name of the key
 * 2. type -> type of the key
 * 3. values -> array of possible values for the key if it is an enum
 * 4. entityName -> name of the entity if the key is a foreign key
 */
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
 * General resuming object.
 * For each entity E, this object contains the couple key-value of
 * - E -> name of the entity
 * - EntityKey[] -> for each key of E, the EntityKey object associated with the key
 */
export const entitiesKeysDictionary: { [key: string]: EntityKey[] } = {
  clienti: [
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
  preventivi: [
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
      keyName: "riferimento",
      type: "text",
    },
    {
      keyName: "operatore",
      type: "text",
    },
    {
      keyName: "feedback",
      type: "text",
    },
    {
      keyName: "note",
      type: "text",
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
  destinazioni: [
    {
      keyName: "nome",
      type: "text",
    },
  ],
  fornitori: [
    {
      keyName: "nome",
      type: "text",
    },
    {
      keyName: "valuta",
      type: "enum",
      values: ["EUR", "USD"],
    },
  ],
  banche: [
    {
      keyName: "nome",
      type: "text",
    },
  ],
  servizi_a_terra: [
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "descrizione",
      type: "text",
    },
    {
      keyName: "valuta",
      type: "enum",
      values: valuteArray,
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
  voli: [
    {
      keyName: "id_preventivo",
      type: "foreign_key",
      entityName: "preventivo",
    },
    {
      keyName: "descrizione",
      type: "text",
    },
    {
      keyName: "valuta",
      type: "enum",
      values: valuteArray,
    },
    {
      keyName: "compagnia_aerea",
      type: "text",
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
  assicurazioni: [
    {
      keyName: "assicurazione",
      type: "text",
    },
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
  preventivi_mostrare_cliente: [
    {
      keyName: "descrizione",
      type: "text",
    },
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
  partecipanti: [
    {
      keyName: "nome",
      type: "text",
    },
    {
      keyName: "cognome",
      type: "text",
    },
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
  incassi_partecipanti: [
    {
      keyName: "id_banca",
      type: "foreign_key",
      entityName: "banca",
    },
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
  pagamenti_servizi_a_terra: [
    {
      keyName: "id_banca",
      type: "foreign_key",
      entityName: "banca",
    },
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
  pagamenti_voli: [
    {
      keyName: "id_banca",
      type: "foreign_key",
      entityName: "banca",
    },
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
  pagamenti_assicurazioni: [
    {
      keyName: "id_banca",
      type: "foreign_key",
      entityName: "banca",
    },
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
  pratiche: [
    {
      keyName: "note",
      type: "text",
    },
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
    name: "destinazioni",
    fetchCallback: fetchAllDestinazioni,
    sampleModel: sampleDestinazione,
  },
  {
    name: "clienti",
    fetchCallback: fetchAllClienti,
    sampleModel: sampleCliente,
  },
  { name: "banche", fetchCallback: fetchAllBanche, sampleModel: sampleBanca },
  {
    name: "fornitori",
    fetchCallback: fetchAllFornitori,
    sampleModel: sampleFornitore,
  },
  {
    name: "pratiche",
    fetchCallback: fetchAllPratiche,
    sampleModel: samplePratica,
  },
  {
    name: "preventivi",
    fetchCallback: fetchAllPreventivi,
    sampleModel: samplePreventivo,
  },
  {
    name: "servizi_a_terra",
    fetchCallback: fetchAllServiziATerra,
    sampleModel: sampleServizioATerra,
  },
  { name: "voli", fetchCallback: fetchAllVoli, sampleModel: sampleVolo },
  {
    name: "assicurazioni",
    fetchCallback: fetchAllAssicurazioni,
    sampleModel: sampleAssicurazione,
  },
  {
    name: "pagamenti_assicurazioni",
    fetchCallback: fetchAllPagamentiAssicurazioni,
    sampleModel: samplePagamentoAssicurazione,
  },
  {
    name: "preventivi_mostrare_clienti",
    fetchCallback: fetchAllPreventiviClienti,
    sampleModel: samplePreventivoMostrareCliente,
  },
  {
    name: "partecipanti",
    fetchCallback: fetchAllPartecipanti,
    sampleModel: samplePartecipante,
  },
  {
    name: "incassi_partecipanti",
    fetchCallback: fetchAllIncassiPartecipanti,
    sampleModel: sampleIncassoPartecipante,
  },
  {
    name: "pagamenti_servizi_a_terra",
    fetchCallback: fetchAllPagamentiServiziATerra,
    sampleModel: samplePagamentoServizioATerra,
  },
  {
    name: "pagamenti_voli",
    fetchCallback: fetchAllPagamentiVoli,
    sampleModel: samplePagamentoVolo,
  },
];
/**
 * Given the entityName of a type of entity, return the names of its foreign_key entities.
 * 
 * TODO: refactor -> is sampleRecord needed?  
 * @param entityName the name of the entity.
 * @returns an object with the dependencies entities names and the sample record of the entity.
 */
export const getDependenciesAndSampleRecord = (
  entityName: string
): {dependenciesNames: string[], sampleRecord: any} => {
  // check if the entityName is valid
  if(!entitiesKeysDictionary[entityName]) throw new Error("Entity not found");
  // get the array of dependencies entities names
  const dependenciesNames: (typeof entities)[number]["name"][] = [];
  // the EntityKey[] corresponding to the given entityName
  const entityKeys = entitiesKeysDictionary[entityName];
  // push to dependenciesNames the entityNames of the dependencies of the given entityName
  entityKeys.forEach((entityKey) => {
    if (entityKey.type == "foreign_key") dependenciesNames.push(entityKey.entityName);
  });
  const entity = entities.find((e) => e.name == entityName);
  // console.log('lkjhgfds', dependenciesNames);
  
  return {
    dependenciesNames: dependenciesNames,
    sampleRecord: entity?.sampleModel,
  };
};
