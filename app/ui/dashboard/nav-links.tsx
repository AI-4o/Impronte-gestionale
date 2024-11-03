'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  PaperAirplaneIcon,
  GlobeEuropeAfricaIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Clienti', href: '/dashboard/clienti', icon: UserGroupIcon },
  { name: 'Destinazioni', href: '/dashboard/destinazioni', icon: GlobeEuropeAfricaIcon },
  { name: 'Fornitori', href: '/dashboard/fornitori', icon: UserGroupIcon },
  { name: 'Preventivi', href: '/dashboard/preventivi', icon: DocumentDuplicateIcon },
  { name: 'Preventivi clienti', href: '/dashboard/preventivi-clienti', icon: DocumentDuplicateIcon },
  { name: 'Servizi a terra', href: '/dashboard/servizi-a-terra', icon: DocumentDuplicateIcon },
  { name: 'Voli', href: '/dashboard/voli', icon: PaperAirplaneIcon },
  { name: 'Assicurazioni', href: '/dashboard/assicurazioni', icon: DocumentDuplicateIcon },
  { name: 'Partecipanti', href: '/dashboard/partecipanti', icon: DocumentDuplicateIcon },
  { name: 'Pratiche', href: '/dashboard/pratiche', icon: DocumentDuplicateIcon },
  { name: 'Pagamenti', href: '/dashboard/pagamenti', icon: CurrencyEuroIcon },
  { name: 'Riepilogo', href: '/dashboard/riepilogo', icon: DocumentDuplicateIcon },

];

export default function NavLinks() {

  const pathName = usePathname();
  
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathName === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
