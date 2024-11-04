import { fetchPreventivoById } from "@/app/lib/data";
import { entities, getDependenciesAndSampleRecord } from "@/app/lib/entities.utils";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import UpdateRecordForm from "@/app/ui/invoices/edit-record-form";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const id = params.id;
  const preventivo = await fetchPreventivoById(id);
  const { dependenciesNames, sampleRecord } = getDependenciesAndSampleRecord('preventivo');
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
        { label: 'Preventivi', href: '/dashboard/preventivi' },
        {
          label: 'Edit Preventivo',
          href: `/dashboard/preventivi/${id}/edit`,
          active: true,
        },
      ]}
    />
    <UpdateRecordForm recordModelName="preventivo" dependenciesData={dependenciesData} recordModel={preventivo} />    
  </main>
  </>
}