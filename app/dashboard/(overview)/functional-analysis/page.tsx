"use client"

import packageJson from '../../../../package.json';
import { FaqSection } from "@/components/blocks/faq";


const DEMO_FAQS = [
    {
        question: "Come si aggiunge un cliente?",
        answer: "Our platform stands out through its intuitive design, powerful automation capabilities, and seamless integration options. We've focused on creating a user experience that combines simplicity with advanced features.",
    },
    {
        question: "Come si aggiornano le info di un cliente?",
        answer: "We provide comprehensive support through multiple channels. This includes 24/7 live chat, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    },
    {
        question: "Come si trovano i preventivi di un cliente?",
        answer: "We offer flexible, transparent pricing tiers designed to scale with your needs. Each tier includes a core set of features, with additional capabilities as you move up. All plans start with a 14-day free trial.",
    },
    {
        question: "Come si crea un preventivo ex novo?",
        answer: "We provide comprehensive support through multiple channels. This includes 24/7 live chat, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    },
    {
        question: "Come si aggiornano le info di un preventivo?",
        answer: "We provide comprehensive support through multiple channels. This includes 24/7 live chat, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    },
    {
        question: "Come si duplica un preventivo?",
        answer: "We provide comprehensive support through multiple channels. This includes 24/7 live chat, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    }   
];

export default function Page() {
    return (
        <div>
            <h1 className={`mb-4 text-xl md:text-2xl`}>ANALISI FUNZIONALE</h1>
            <p><i>In questa pagina verrà descritto il funzionamento dell'applicazione alla versione attuale {packageJson.version}.</i></p>

            <h2 className='mt-4 font-bold'>FUNZIONALITÀ</h2>

            <FaqSection
                title="Come si fa?"
                description="Everything you need to know to sleep well at night"
                items={DEMO_FAQS}
                contactInfo={{
                    title: "Still have questions?",
                    description: "We're here to help you (maybe)",
                    buttonText: "Contact Support",
                    onContact: () => alert("...Chiedi a Serenella."),
                }}
            />



            <h2 className='mt-4 font-bold'>SHORTCUTS</h2>
            <ul>
                <li>Alt + @ + # + 1 → vai a pagina <b>changelog</b></li>
                <li>Alt + @ + # + 2 → vai a pagina <b>preventivo</b></li>
                <li>Alt + @ + # + 3 → vai a pagina <b>data table</b></li>
                <li>Alt + @ + # + 4 → vai a pagina <b>aggiungi</b></li>
            </ul>

            <h2 className='mt-4 font-bold'>MODIFICHE FUTURE</h2>
            <ul>
                <li>Aggiungere memoria impostazioni settate da utente.</li>
                <li>Aggiungere logica dei pagamenti.</li>
                <li>“anche a tutto schermo sul portatile non si riesce a leggere cosa c'è scritto nei campi“* → aggiunta in settings possibilità di configurare layout degli input-group dell’interfaccia</li>
            </ul>
        </div>
    );
}