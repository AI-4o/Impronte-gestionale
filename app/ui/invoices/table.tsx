import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';


export interface TableInterface<T> {
  dataName: string;
  fetchFunction: <T>() => Promise<T[]>;
}

export default async function ClientiTable<T>({
  dataName,
  fetchFunction
}: TableInterface<T>) {
  const clienti = ((await fetchFunction()) as T[])
  // TODO: generalize with a method
  // that depends directly from the type of the data 
  .map((c: T) => {
    return Object.keys(c).reduce((acc, key) => {
      if (typeof c[key] === 'number') {
        acc[key] = formatCurrency(c[key]);
      }
      else if (typeof c[key] === 'object') {
        if (c[key] instanceof Date) {
          const date = new Date(c[key]);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          acc[key] = `${day}-${month}-${year}`;
        } else {// general object case
          acc[key] = c[key].toString();
        }
      }
      else {
        acc[key] = c[key];
      }
      return acc;
    }, {} as Record<string, any>);
  })
  
  const columns = Object.keys(clienti[0]);
  console.log('jhgfds',clienti, columns);

const clientiRows = clienti?.map((clienti) => {
  return (
    <tr key={clienti.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {Object.keys(clienti)
      .map((key) => (
        <td key={key} className="whitespace-nowrap py-3 pl-6 pr-3">
          <div className="flex items-center gap-3">
            <p>{clienti[key]}</p>
          </div>
        </td>
      ))}
      <td className="whitespace-nowrap px-3 py-3">
        <InvoiceStatus status={clienti.status} />
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <UpdateInvoice id={clienti.id} rowName = {dataName} />
          <DeleteInvoice id={clienti.id} rowName = {dataName}/>
        </div>
      </td>
    </tr>
  );
});

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {columns?.map((column) => (
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {clientiRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
