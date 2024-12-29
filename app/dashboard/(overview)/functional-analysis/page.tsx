import packageJson from '../../../../package.json';


export default function Page() {

    return (
        <div>
             <h1 className={`mb-4 text-xl md:text-2xl`}>ANALISI FUNZIONALE</h1>
             <p><i>In questa pagina viene descritto il funzionamento dell'applicazione alla versione {packageJson.version}.</i></p>
        </div>
    );
}