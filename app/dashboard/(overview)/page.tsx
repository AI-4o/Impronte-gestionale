import { lusitana } from '@/app/ui/fonts';
import './style.css';

export default async function ChangelogPage() {  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Changelog</h1>
      <p className='version-paragraph'>V1.0.0</p>
      <ul>
        <li>Feat: add CRUD operations for entities connected to related tables, navigation, authentication logic. </li>
      </ul>
      <p className='version-paragraph'>V1.1.0</p>
      <ul>
        <li>Feat: add management of case when no data is found in table for a search query.</li>
        <li>Refactor: refactor of the code, adding some comments and improve the overall code quality.</li>
        <li>Feat: new layout for sidenav featuring: 'changelog', 'tabelle', 'general interface'.</li>
        <li>Feat: general interface --- implement layout of general interface</li>
        <li>Fix: fix crud bugs for all entities.</li>
      </ul>
    </main>
  );
}