import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateRecordForm from '@/app/ui/invoices/create-record-form';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { entities, getDependenciesAndSampleRecord } from '@/app/lib/entities.utils';

export default async function CreateServizioATerra() {

  const { dependenciesNames, sampleRecord } = getDependenciesAndSampleRecord('servizio_a_terra');
  // fetch all dependencies entities
  const dependenciesData = await Promise.all(
    entities
      // filter the entities that are dependencies of the record model
      .filter(entity => dependenciesNames.includes(entity.name))
      // fetch the data of such dependencies
      .map(entity => entity.fetchCallback())
  );
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clienti', href: '/dashboard/clienti' },
          {
            label: 'Aggiungi Servizio a Terra',
            href: '/dashboard/servizi-a-terra/create',
            active: true,
          },
        ]}
      />
      <Suspense key="create-cliente" fallback={<LatestInvoicesSkeleton />}>
        <CreateRecordForm
          recordModelName='servizio_a_terra'
          dependenciesData={dependenciesData}
        />
      </Suspense>
    </main>
  );
}