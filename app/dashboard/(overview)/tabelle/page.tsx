import { UserGroupIcon } from "@heroicons/react/24/outline";
import { GlobeEuropeAfricaIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { CurrencyEuroIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import './style.css';
import { lusitana } from "@/app/ui/fonts";

export default function TabellePage() {
const linksTabelle = [
    { name: 'Clienti', href: '/dashboard/clienti', icon: UserGroupIcon },
    { name: 'Destinazioni', href: '/dashboard/destinazioni', icon: GlobeEuropeAfricaIcon },
    { name: 'Fornitori', href: '/dashboard/fornitori', icon: UserGroupIcon },
    { name: 'Preventivi', href: '/dashboard/preventivi', icon: DocumentDuplicateIcon },
    { name: 'Preventivi clienti', href: '/dashboard/preventivo_mostrare_cliente', icon: DocumentDuplicateIcon },
    { name: 'Servizi a terra', href: '/dashboard/servizi-a-terra', icon: DocumentDuplicateIcon },
    { name: 'Voli', href: '/dashboard/voli', icon: PaperAirplaneIcon },
    { name: 'Assicurazioni', href: '/dashboard/assicurazioni', icon: DocumentDuplicateIcon },
    { name: 'Partecipanti', href: '/dashboard/partecipanti', icon: DocumentDuplicateIcon },
    { name: 'Pratiche', href: '/dashboard/pratiche', icon: DocumentDuplicateIcon },
    { name: 'Pagamenti', href: '/dashboard/pagamenti', icon: CurrencyEuroIcon },
    { name: 'Riepilogo', href: '/dashboard/riepilogo', icon: DocumentDuplicateIcon },
]
    return (
        <div>
            <h1 className={`${lusitana.className} text-2xl`}>Tabelle</h1>
            {linksTabelle.map((link) => (
                <Link key={link.name} href={link.href}>
                    <div className="link-div">
                    <link.icon className="w-6 h-6" />
                    {link.name}
                    </div>
                </Link>
            ))}
        </div>
    );
}