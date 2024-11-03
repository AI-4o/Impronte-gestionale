import { fetchClienteById, fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import { entities, getDependenciesAndSampleRecord } from "@/app/lib/entities.utils";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/edit-form";
import UpdateRecordForm from "@/app/ui/invoices/edit-record-form";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const id = params.id;
  const cliente = await fetchClienteById(id);
  const { dependenciesNames, sampleRecord } = getDependenciesAndSampleRecord('cliente');
  const dependenciesData = await Promise.all(
    entities
      // filter the entities that are dependencies of the record model
      .filter(entity => dependenciesNames.includes(entity.name))
      // fetch the data of such dependencies
      .map(entity => entity.fetchCallback())
  );  
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
    <UpdateRecordForm recordModelName="cliente" dependenciesData={dependenciesData} recordModel={cliente} />    
  </main>
  </>
}