import { deleteEntity, deleteInvoice } from '@/app/lib/actions/actions';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateRecord({
  recordName
}: {
  recordName: string;
}) {
  return (
    <Link
      href={`/dashboard/${recordName}/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export interface UpdateRow{
  id: string;
  rowName: string;
}
export function UpdateInvoice({ id, entityName }: { id: string, entityName: string }) {
  return (
    <Link
      href={`/dashboard/${entityName}/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
// TODO: add custom action for delete
export function DeleteEntity({ id, entityName }: { id: string, entityName: string }) {
  const deleteEntityWithId = deleteEntity.bind(null, id, entityName);
  return (
    <form action={deleteEntityWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
