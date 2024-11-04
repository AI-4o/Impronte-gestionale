

import { fetchPagamentiVoliPages, fetchFilteredPagamentiVoli } from "@/app/lib/data";
import { PagamentoVolo } from "@/app/lib/definitions";
import { lusitana } from "@/app/ui/fonts";
import { CreateRecord } from "@/app/ui/invoices/buttons";
import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Pagamenti',
  };

export default async function Pagamenti(
      props: {
          searchParams?: Promise<{
            query?: string;
            page?: string;
          }>;
        }
    ) {

    
      return <div className="w-full">
        pagamenti
      </div>;
    }