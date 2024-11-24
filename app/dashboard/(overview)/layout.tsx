import SideNav from '@/app/ui/dashboard/sidenav';
import { Suspense } from 'react';
import Loading from './loading';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Map of links to display in the side navigation.
  const links = [
    { name: 'Changelog', href: '/dashboard' },
    { name: 'Tabelle', href: '/dashboard/tabelle' },
    { name: 'General Interface', href: '/dashboard/general-interface' },
  ];
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav links={links} />
      </div>
      <Suspense fallback={<Loading />}>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </Suspense>
    </div>
  );
}