import { fetchServizioATerraById } from "@/app/lib/data";
import { entities, getDependenciesAndSampleRecord } from "@/app/lib/entities.utils";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import UpdateRecordForm from "@/app/ui/invoices/edit-record-form";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const id = params.id;
  const servizioATerra = await fetchServizioATerraById(id);
  const { dependenciesNames, sampleRecord } = getDependenciesAndSampleRecord('servizio_a_terra');
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
        { label: 'Servizi a Terra', href: '/dashboard/servizi-a-terra' },
        {
          label: 'Edit Servizio a Terra',
          href: `/dashboard/servizi-a-terra/${id}/edit`,
          active: true,
        },
      ]}
    />
    <UpdateRecordForm recordModelName="servizio_a_terra" dependenciesData={dependenciesData} recordModel={servizioATerra} />    
  </main>
  </>
}