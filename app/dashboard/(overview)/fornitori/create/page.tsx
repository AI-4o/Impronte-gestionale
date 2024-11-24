import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateRecordForm from '@/app/ui/invoices/create-record-form';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { entities, getDependenciesAndSampleRecord } from '@/app/lib/entities.utils';

export default async function CreateFornitore() {

  const { dependenciesNames, sampleRecord } = getDependenciesAndSampleRecord('fornitori');
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
          { label: 'Fornitori', href: '/dashboard/fornitori' },
          {
            label: 'Aggiungi Fornitore',
            href: '/dashboard/fornitori/create',
            active: true,
          },
        ]}
      />
      <Suspense key="create-fornitore" fallback={<LatestInvoicesSkeleton />}>
        <CreateRecordForm
          recordModelName='fornitori'
          dependenciesData={dependenciesData}
        />
      </Suspense>
    </main>
  );
}