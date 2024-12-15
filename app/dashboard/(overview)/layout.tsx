import SideNav from '@/app/ui/dashboard/sidenav';
import { Suspense } from 'react';
import Loading from './loading';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Map of links to display in the side navigation.
  const links = [
    { name: 'Changelog', href: '/dashboard' },
    { name: 'Tabelle', href: '/dashboard/tabelle' },
    { name: 'Crea Preventivo', href: '/dashboard/general-interface-create' },
  ];
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <SideNav links={links} />
      <Suspense fallback={<Loading />}>
        <div className="flex-grow  md:overflow-y-auto p-3 w-full">{children}</div>
      </Suspense>
    </div>
  );
}