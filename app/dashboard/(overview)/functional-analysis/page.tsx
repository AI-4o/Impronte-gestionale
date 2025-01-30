import packageJson from '../../../../package.json';


export default function Page() {

    return (
        <div>
             <h1 className={`mb-4 text-xl md:text-2xl`}>ANALISI FUNZIONALE</h1>
             <p><i>In questa pagina verrà descritto il funzionamento dell'applicazione alla versione attuale {packageJson.version}.</i></p>
             
             <h2 className='mt-4 font-bold'>SHORTCUTS</h2>
             <ul>
                <li>Alt + @ + # + 1 → vai a pagina <b>changelog</b></li>
                <li>Alt + @ + # + 2 → vai a pagina <b>preventivo</b></li>
                <li>Alt + @ + # + 3 → vai a pagina <b>data table</b></li>
                <li>Alt + @ + # + 4 → vai a pagina <b>aggiungi</b></li>
             </ul>
             
             <h2 className='mt-4 font-bold'>MODIFICHE FUTURE</h2>
             <ul>
             <li>Aggiunta logica dei pagamenti.</li>
             <li>“anche a tutto schermo sul portatile non si riesce a leggere cosa c'è scritto nei campi“* → aggiunta in settings possibilità di configurare layout degli input-group dell’interfaccia</li>
             <li>Andranno inseriti dei tasti tipo pulisci o nuova ricerca nei clienti, annulla .... da vedere forse insieme ... in modo da rendere più fluido l'uso</li>
             </ul>
        </div>
    );
}