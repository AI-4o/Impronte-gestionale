import { UserGroupIcon } from "@heroicons/react/24/outline";
import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/outline";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
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
    { name: 'Pratiche', href: '/dashboard/pratiche', icon: DocumentDuplicateIcon },
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