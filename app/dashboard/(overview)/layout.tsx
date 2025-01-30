import SideNav from '@/app/ui/dashboard/sidenav';
import { Suspense } from 'react';
import Loading from './loading';
import Image from 'next/image';
import { CogIcon, DocumentDuplicateIcon, MagnifyingGlassIcon, PlusIcon, TableCellsIcon} from '@heroicons/react/24/outline';
import { SpinnerContextProvider } from '@/app/context/spinner-context';
import './style.css';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Map of links to display in the side navigation.
  const links = [
    { name: 'Changelog', href: '/dashboard', icon: <DocumentDuplicateIcon className="w-6" /> },
    { name: 'Preventivo', href: '/dashboard/general-interface' },
    { name: 'DataTable', href: '/dashboard/data-table', icon: <TableCellsIcon className="w-6" /> },
    { name: 'Aggiungi', href: '/dashboard/aggiungi', icon: <PlusIcon className="w-6" />},
    { name: 'Analisi funzionale', href: '/dashboard/functional-analysis', icon: <MagnifyingGlassIcon className="w-6" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <CogIcon className="w-6" />}
  ];

  return (
    <SpinnerContextProvider>
      <div className="flex h-screen flex-col">
        <div className='m-2 pb-8 logo-container'>
          <Image className='sidenav__logo' src="https://www.iwsafari.com/sites/default/files/verde.jpg" alt="logo" width={257} height={100} />
        </div>
        <div className='flex  flex-col md:flex-row md:overflow-hidden'>
          <SideNav links={links} />
          <Suspense fallback={<Loading />}>
            <div className="flex-grow  md:overflow-y-auto p-3 w-full">{children}</div>
          </Suspense>
        </div>
      </div>
    </SpinnerContextProvider>
  );
}