import { fetchClienteById } from "@/app/lib/data";
import { Cliente } from "@/app/lib/definitions";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import UpdateRecordForm from "@/app/ui/invoices/edit-record-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const cliente = await fetchClienteById(id);

  return <>
  <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Clienti', href: '/dashboard/clienti' },
        {
          label: 'Edit Cliente',
          href: `/dashboard/clienti/${id}/edit`,
          active: true,
        },
      ]}
    />

    <UpdateRecordForm<Cliente> 
    recordModelName="cliente" 
    recordModel={cliente} 
    //dependenciesData={dependenciesData} 
    />    
  </main>
  </>
}