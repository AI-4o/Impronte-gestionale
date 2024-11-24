import { EntityKey } from '@/app/lib/entities.utils';
import { entitiesKeysDictionary } from '@/app/lib/entities.utils';
import { UpdateInvoice, DeleteEntity } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';

export interface TableInterface<T> {
  dataName: string;
  fetchFunction: () => Promise<T[]>;
}

export default async function Table<T>({
  dataName,
  fetchFunction
}: TableInterface<T>) {

  // fetch data for the rows
  const data = ((await fetchFunction()) as T[])
    // TODO: generalize with a method
    // that depends directly from the type of the data 
    .map((c: T) => {
      return Object.keys(c).reduce((acc, key) => {
        if (typeof c[key] === 'number') {
          acc[key] = c[key].toString();
        }
        else if (typeof c[key] === 'object') {
          // console.log(c[key], 'object!!');

          if (c[key] instanceof Date) {
            const date = new Date(c[key]);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            acc[key] = `${day}-${month}-${year}`;
          } else {// general object case
            acc[key] = c[key]?.toString();
          }
        }
        else {
          acc[key] = c[key];
        }
        return acc;
      }, {} as Record<string, any>);
    })

  const recordModelKeys = entitiesKeysDictionary[dataName] as EntityKey[];
  const columns =
    <>
      {recordModelKeys
        ?.filter(key => key.keyName !== 'id')
        ?.map((column) => (
          <th key={column.keyName} scope="col" className="px-4 py-5 font-medium sm:pl-6">
            {column.keyName}
          </th>
        ))}
    </>

  const rows = data?.map((x) => {
    return (
      <tr key={x.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
        {Object.keys(x)
          .filter(key => key !== 'id')
          .map((key) => (
            <td key={key} className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex items-center gap-3">
                <p>{x[key]}</p>
              </div>
            </td>
          ))}
        <td className="whitespace-nowrap px-3 py-3">
          <InvoiceStatus status={x.status} />
        </td>
        <td className="whitespace-nowrap py-3 pl-6 pr-3">
          <div className="flex justify-end gap-3">
            <UpdateInvoice id={x.id} entityName={dataName} />
            <DeleteEntity id={x.id} entityName={dataName} />
          </div>
        </td>
      </tr>
    );
  });

  /**
   * Render the table body, if no rows are found, render a message
   * @returns the jsx element for the table body
   */
  const renderTableBody = (): JSX.Element => {
    if (rows.length) {
      return <tbody className="bg-white">{rows}</tbody>
    }
    return (
      <tbody className="bg-white">
        <tr>
          <td colSpan={recordModelKeys.length + 2} className="text-center">Nessun dato trovato.</td>
        </tr>
      </tbody>
    )
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {columns}
              </tr>
            </thead>
            {renderTableBody()}
          </table>
        </div>
      </div>
    </div>
  );
}
