

import { fetchDestinazioniPages, fetchFilteredDestinazioni } from "@/app/lib/data";
import { Destinazione } from "@/app/lib/definitions";
import { lusitana } from "@/app/ui/fonts";
import { CreateRecord } from "@/app/ui/invoices/buttons";
import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Destinazioni',
  };

export default async function Destinazioni(
      props: {
          searchParams?: Promise<{
            query?: string;
            page?: string;
          }>;
        }
    ) {
      const searchParams = await props.searchParams;
    
      const query = searchParams?.query || '';
      const currentPage = Number(searchParams?.page) || 1;
      const totalPages = await fetchDestinazioniPages(query);
    
      return <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Destinazioni</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search destinazioni..." />
        <CreateRecord recordName="destinazioni" />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table<Destinazione> dataName="destinazioni" fetchFunction={() => fetchFilteredDestinazioni(query, currentPage)} />
      </Suspense> 
      <div className="mt-5 flex w-full justify-center">
       <Pagination totalPages={totalPages} />
      </div>
    </div>;
    }