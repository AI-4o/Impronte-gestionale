import './style.css';

export default async function ChangelogPage() {
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>CHANGELOG</h1>

      <p><i>In questa pagina è possibile vedere le modifiche apportate ad ogni versione del progetto, distinte in 'Features' e 'Fix'. </i></p>
      
      <p className='version-paragraph'>v2.6.0</p>
      <ul>
        <li>Fix: optimize cliente research in interface.</li>
        <li>Feat: add the following fields to preventivo entity: destinazioone, tipo_viaggio, note_operative.</li>
        <li>Feat: add the following fields to cliente entity: luogo di nascita, provincia di nascita, numero passaporto, data scadenza passaporto, nazionalità, provincia, sesso.</li>
        <li>Feat: add CLEAR btn to clear the preventivo interface.</li>
        <li>Feat: add signup page for testing user-specific custom settings.</li>
        <li>Feat: add tabella clienti.</li>
        <li>Feat: add tabella preventivi.</li>
        <li>Feat: migration to new DB, deployment on domain.</li>
      </ul>
      <p className='version-paragraph'>v2.5.0</p>
      <ul>
        <li>Feat: add first sketch of data table about preventivi.</li>
        <li>Feat: add <i>preventivo cliente section</i> to preventivo interface with: create, and get crud operations.</li>
        <li>Feat: add keyboard shortcuts to navigate the app, as described in page 'functional analysis'.</li>
      </ul>
      <p className='version-paragraph'>V2.4.0</p>
      <ul>
        <li>Feat: create input-lookup input component, use it in place of input select when there are too many options (e.g.: valute, fornitori).</li>
        <li>Fix: <i>nelle assicurazioni c'è da aggiungere il n. (come nei voli) e il totale sarà dato da (netto+ricarico)*numero.</i></li>
        <li>Fix: <i>nel cliente la data di nascita "non" deve essere obbligatoria.</i></li>
        <li>Fix: for 'valute' use a general complete list.</li>
      </ul>
      <p className='version-paragraph'>V2.3.0</p>
      <ul>
        <li>Feat: add page 'Settings' + draft allow custom success message styles.</li>
        <li>Fix: <i>le date devono poter essere inserite da tastiera.</i></li>
        <li>Fix: <i>anche sulle assicurazioni bisogna aggiungere il campo ricarico come input che inseriamo noi di volta in volta ed il totale sarà dato dal netto + ricarico.</i></li>
        <li>Feat: update layout of input groups for preventivo interface.</li>
        <li>Feat: add spinner to manifest the loading state of the app.</li>
        <li>Feat: add logo.</li>
        <li>Fix: <i>la percentuale di ricarico che noi inseriamo deve essere memorizzata per ogni preventivo (ho provato a fare una variazione e la percentuale di ricarico ogni volta 
          che si apre il preventivo torna ad essere uno, invece deve essere quella da noi inserita per quel preventivo specifico).</i></li>
        <li>Fix: <i>in fase di variazione di preventivo cliccando sul tasto aggiorna non succede niente e la variazione non viene memorizzata.</i></li>
      </ul>
      <p className='version-paragraph'>V2.2.0</p>
      <ul>
          <li>Feat: In 'cliente', add 'IMS' as a possible value for 'provenienza'.</li>
          <li>Feat: In 'preventivo', add 'number of rooms' field next to 'number of nights'.</li>
          <li>Feat: For 'voli', add 'numero' field after 'ricarico'.</li>
          <li>Feat: In 'preventivo', add 'brand' field with possible values: IWS, ISE, INO, IMS, BORN.</li>
          <li>Feat: Show form validation error lists on 'createPreventivo'.</li>
          <li>Feat: In 'preventivo' form, 'numero preventivo' should be computed automatically by an incremental algorithm.</li>
          <li>Feat: In 'preventivo' form, display 'numero preventivo' in the format 000x (e.g., 0001, 0013, 0123).</li>
          <li>Feat: Change 'note' input field to be a text area.</li>
          <li>Feat: In 'cliente' form, add new fields: 'indirizzo' (address), 'CAP' (postal code), 'città' (city), 'CF' (tax code).</li>
          <li>Feat: Show form validation error lists on 'updateCliente'.</li>
          <li>Feat: Show form validation error lists on 'updatePreventivo'.</li>
          <li>Feat: Show form validation error lists on 'createCliente'.</li>
          <li>Feat: In 'preventivo' form, 'operatore' should be a select input with options: Serenella, Carlo, Silvia, Valentina, Elena.</li>
          <li>Fix: In 'preventivo' form, make 'operatore' a required field.</li>
          <li>Fix: For 'servizi a terra' and 'servizi aggiuntivi', calculate 'ricarico' as: ricarico = (numero_notti * numero_camere * importo * percentuale_ricarico) / cambio.</li>
          <li>Fix: For 'servizi a terra' and 'servizi aggiuntivi', calculate 'tot_euro' as: tot_euro = (numero_notti * numero_camere * importo) / cambio + ricarico.</li>
          <li>Fix: For 'voli', 'ricarico' is entered by the user and not calculated automatically.</li>
          <li>Fix: For 'voli', calculate 'tot_euro' as: tot_euro = numero * (totale / cambio + ricarico).</li>
          <li>Fix: Show submission success message only if there are no errors.</li>
          <li>Fix: In 'preventivo' form, make 'brand' a required field.</li>
          <li>Fix: In 'cliente' form, make 'email' a required field.</li>
          <li>Fix: In 'cliente' form, make 'telefono' an optional field.</li>
      </ul>
      <p className='version-paragraph'>V2.1.0</p>
      <ul>
        <li>Fix: servizi a terra and servizi aggiuntivi, markup should be calculated as: ricarico = (numero_notti * numero_camere * importo * percentuale_ricarico) / cambio.</li>
        <li>Fix: servizi a terra and servizi aggiuntivi, tot_euro should be calculated as: tot_euro = (numero_notti * numero_camere * importo) / cambio + ricarico.</li>
        <li>Feat: for voli, add a "numero" field next to ricarico.</li>
        <li>Fix: in the case of voli, ricarico is entered by the user and is not calculated using the above formulas.</li>
        <li>Fix: voli, tot_euro should be calculated as: tot_euro = numero * (totale / cambio + ricarico).</li>
      </ul>
      <p className='version-paragraph'>V2.0.0</p>
      <ul>
        <li>Feat: Ensure each input group occupies a single row (e.g., each 'servizio a terra' occupies one row).</li>
        <li>Feat: Update '+' and '-' buttons to allow deletion of any selected row, not just the last one.</li>
        <li>Fix: Add 'fornitore' (supplier) and 'destinazione' (destination) fields to 'servizi a terra' forms in the general interface.</li>
        <li>Fix: Add 'fornitore' (supplier) field to 'voli' (flights) forms.</li>
        <li>Feat: Display 'tot_euro' sum for 'servizi a terra' and additional services.</li>
        <li>Feat: Display calculations: <i>ricarico = totale / cambio * percentuale_ricarico</i>; <i>tot_euro = totale / cambio + ricarico</i>.</li>
        <li>Feat: Add numeric input field 'percentuale_ricarico' used to calculate 'tot_euro' and 'ricarico' (ricarico is automatically calculated and displayed).</li>
        <li>Refactor: Ensure 'tot_euro' is consistently named 'tot_euro'.</li>
        <li>Feat: Display 'ricarico' for various services (calculated as (totale / cambio) * percentuale_ricarico); no front-end modifications required.</li>
        <li>Feat: For 'assicurazioni' (insurances), input 'totale' (always in euros), then input 'ricarico', and 'tot_euro' is calculated as 'totale + ricarico'.</li>
        <li>Feat: Display total value calculated as the sum of 'tot'.</li>
        <li>Fix: Adjust width of currency input select so values are visible.</li>
        <li>Fix: Fix 'update cliente' functionality.</li>
        <li>Fix: Fix 'create cliente' functionality.</li>
        <li>Fix: Remove 'email' from 'preventivo' fields (same as 'cliente').</li>
        <li>Fix: Remove 'numero di telefono' from 'preventivo' fields (same as 'cliente').</li>
      </ul>
      <p className='version-paragraph'>V1.1.0</p>
      <ul>
        <li>Feat: add management of case when no data is found in table for a search query.</li>
        <li>Refactor: general refactoring of the code, adding some comments and improving the overall code quality.</li>
        <li>Feat: new layout for sidenav featuring: <i>'Changelog'</i>, <i>'Tabelle'</i>, <i>'General Interface'</i>.</li>
        <li>Feat: general interface --- implement layout of general interface</li>
        <li>Fix: fix crud bugs for all entities.</li>
        <li>Feat: let <i>entity-input-group</i> update the recordModel as a state of the parent component.</li>
        <li>Feat: create <i>entity-input-group-with-payments</i> component.</li>
      </ul>
      <p className='version-paragraph'>V1.0.0</p>
      <ul>
        <li>Feat: add CRUD operations for entities connected to related tables, navigation, authentication logic. </li>
      </ul>
    </main>
  );
}