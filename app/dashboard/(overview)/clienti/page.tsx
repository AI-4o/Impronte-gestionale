import { fetchFilteredClienti, fetchClientiPages } from "@/app/lib/data";
import { Cliente } from "@/app/lib/definitions";
import { getDependenciesAndSampleRecord } from "@/app/lib/entities.utils";
import { entities } from "@/app/lib/entities.utils";
import { lusitana } from "@/app/ui/fonts";
import { CreateRecord } from "@/app/ui/invoices/buttons";
import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: 'Clienti',
};

/* 
lavoro con i search params della query string per aggiornare la tabella 
dall'input-search mando i serach params alla query string, poi li recupero nella Page di questo file con feat di Next.js
quindi li mando alla tabella che fetcha
*/
export default async function Page(
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
  const totalPages = await fetchClientiPages(query);

  const { dependenciesNames } = getDependenciesAndSampleRecord('clienti'); //TODO: refactor this logic
  const dependenciesData = await Promise.all(
    entities
      // filter the entities that are dependencies of the record model
      .filter(entity => dependenciesNames.includes(entity.name))
      // fetch the data of such dependencies
      .map(entity => entity.fetchCallback())
  );  
  return <div className="w-full">
  <div className="flex w-full items-center justify-between">
    <h1 className={`${lusitana.className} text-2xl`}>Clienti</h1>
    {query && <p>Query: {query}</p>}
  </div>
  <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
    <Search placeholder="Search clienti..." />
    <CreateRecord recordName="clienti" />
  </div>
   <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
    <Table<Cliente> dataName="clienti" fetchFunction={() => fetchFilteredClienti(query, currentPage)}  />
  </Suspense> 
  <div className="mt-5 flex w-full justify-center">
   <Pagination totalPages={totalPages} />
  </div>

  <div>
    <p>Attenzione, se si elimina un cliente, si eliminano anche tutti i dati delle entità che dipendono da esso!
       Da un cliente possono dipendere:</p>
    <ul>
      {dependenciesNames.map(d => <li key={d}>{d}</li>)}
    </ul>
  </div>
  </div>;
}