import SideNav from '@/app/ui/dashboard/sidenav';
import { Suspense } from 'react';
import Loading from './loading';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <Suspense fallback={<Loading/>}>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </Suspense>
    </div>
  );
}

// Suspence si usa insieme a loading.tsx (nomi che vengono riconosciuti da next.js) per avere una fallback page mentre il contenuto della pagina si sta caricando