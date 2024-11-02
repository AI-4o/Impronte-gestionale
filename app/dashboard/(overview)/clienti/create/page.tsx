import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clienti', href: '/dashboard/clienti' },
          {
            label: 'Aggiungi Cliente',
            href: '/dashboard/clienti/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}