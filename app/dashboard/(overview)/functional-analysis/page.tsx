import packageJson from '../../../../package.json';


export default function Page() {

    return (
        <div>
             <h1 className={`mb-4 text-xl md:text-2xl`}>ANALISI FUNZIONALE</h1>
             <p><i>In questa pagina verrà descritto il funzionamento dell'applicazione alla versione attuale {packageJson.version}.</i></p>
             <h2 className='mt-4 font-bold'>MODIFICHE IN CORSO</h2>
             <ul>
             <li>“anche a tutto schermo sul portatile non si riesce a leggere cosa c'è scritto nei campi“* → aggiunta in settings possibilità di configurare layout degli input-group dell’interfaccia</li>
             <li>⁠andranno inseriti dei tasti tipo pulisci o nuova ricerca nei clienti, annulla .... da vedere forse insieme ... in modo da rendere più fluido l'uso</li>
             <li>i campi come il cambio e il ricarico bisogna scriverci qualcosa altrimenti con il valore che c'è in automatico non funzionano (?)</li>
             </ul>
        </div>
    );
}