import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateRecordForm from '@/app/ui/invoices/create-record-form';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { entities, getDependenciesAndSampleRecord } from '@/app/lib/entities.utils';

export default async function CreateDestinazione() {

  const { dependenciesNames, sampleRecord } = getDependenciesAndSampleRecord('destinazioni');
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
            label: 'Aggiungi Destinazione',
            href: '/dashboard/destinazioni/create',
            active: true,
          },
        ]}
      />
      <Suspense key="create-destinazione" fallback={<LatestInvoicesSkeleton />}>
        <CreateRecordForm
          recordModelName='destinazione'
          dependenciesData={dependenciesData}
        />
      </Suspense>
    </main>
  );
}