import { db } from "@vercel/postgres";
import destinazioni from './destinazioni.json';
import fornitori from './fornitori.json';
import clienti from './clienti.json';
const client = await db.connect();

const createTableDestinazioni = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS destinazioni (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         nome VARCHAR(255) NOT NULL,
         UNIQUE (nome)
      );
    `;
}
const createTableClienti = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS clienti (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         nome VARCHAR(255) NOT NULL,
         cognome VARCHAR(255) NOT NULL,
         tel VARCHAR(20),
         email VARCHAR(255),
         tipo VARCHAR(20) CHECK (tipo IN ('PRIVATO', 'AGENZIA VIAGGI', 'AZIENDA')),
         provenienza VARCHAR(20) CHECK (provenienza IN ('Passaparola', 'Sito IWS', 'Sito INO', 'Telefono', 'Email Diretta', 'Sito ISE')),
         collegato VARCHAR(255),
         citta VARCHAR(255),
         note TEXT,
         data_di_nascita DATE,
         UNIQUE (nome, cognome)
      );
    `;
}
const createTableFornitori = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS fornitori (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         nome VARCHAR(255) NOT NULL,
         valuta VARCHAR(10),
         UNIQUE (nome)
      );
    `;
}
const createTablePreventivi = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS preventivi (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_cliente UUID NOT NULL REFERENCES clienti(id),
         email VARCHAR(255) NOT NULL,
         numero_di_telefono VARCHAR(20),
         id_fornitore UUID,
         note TEXT,
         adulti INT,
         bambini INT,
         riferimento VARCHAR(255),
         data_partenza DATE,
         operatore VARCHAR(255),
         feedback TEXT,
         stato VARCHAR(20) CHECK (stato IN ('da fare', 'in trattativa', 'confermato', 'inviato')),
         data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         numero_preventivo VARCHAR(255),
         confermato BOOLEAN
      );
    `;
}
const createTableServiziATerra = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS servizi_a_terra (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_fornitore UUID NOT NULL REFERENCES fornitori(id),
         id_destinazione UUID NOT NULL REFERENCES destinazioni(id),
         descrizione TEXT,
         data DATE,
         numero_notti INT,
         totale FLOAT,
         valuta VARCHAR(10),
         cambio FLOAT,
         ricarico FLOAT,
         servizio_aggiuntivi BOOLEAN
      );
    `;
}
const createTableVoli = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS voli (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_fornitore UUID NOT NULL REFERENCES fornitori(id),
         compagnia_aerea VARCHAR(255),
         descrizione TEXT,
         data_partenza DATE,
         data_arrivo DATE,
         totale FLOAT,
         valuta VARCHAR(10),
         cambio FLOAT,
         ricarico FLOAT
      );
    `;

}
const createTableAssicurazioni = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS assicurazioni (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_fornitore UUID NOT NULL REFERENCES fornitori(id),
         assicurazione VARCHAR(255),
         netto FLOAT,
         ricarico FLOAT
      );
    `;
}
const createTablePreventivoMostrareCliente = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS preventivo_mostrare_cliente (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_destinazione UUID NOT NULL REFERENCES destinazioni(id),
         descrizione TEXT,
         tipo VARCHAR(50) CHECK (tipo IN ('destinazione', 'volo', 'assicurazione')),
         costo_individuale FLOAT,
         importo_vendita FLOAT,
         totale FLOAT
      );
    `;
}
const createTablePartecipanti = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS partecipanti (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         nome VARCHAR(255),
         cognome VARCHAR(255),
         tot_quota FLOAT
      );
    `;
}
const createTableIncassiPartecipanti = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS incassi_partecipanti (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_partecipante UUID NOT NULL REFERENCES partecipanti(id),
         banca VARCHAR(255),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `;
} 
const createTablePagamentiServiziATerra = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS pagamenti_servizi_a_terra (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_fornitore UUID NOT NULL REFERENCES fornitori(id),
         id_servizio_a_terra UUID NOT NULL REFERENCES servizi_a_terra(id),
         banca VARCHAR(255),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `;
}
const createTablePagamentiVoli = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS pagamenti_voli (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_fornitore UUID NOT NULL REFERENCES fornitori(id),
         id_volo UUID NOT NULL REFERENCES voli(id),
         banca VARCHAR(255),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `;
}
const createTablePagamentiAssicurazioni = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS pagamenti_assicurazioni (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_fornitore UUID NOT NULL REFERENCES fornitori(id),
         id_assicurazione UUID NOT NULL REFERENCES assicurazioni(id),
         banca VARCHAR(255),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `;
}
const createTablePratiche = async () => {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS pratiche (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_cliente UUID NOT NULL REFERENCES clienti(id),
         data_conferma DATE,
         data_partenza DATE,
         data_rientro DATE,
         note TEXT,
         numero_passeggeri INT,
         totale FLOAT
      );
    `;
}

const seedDestinazioni = async () => {
  for (const nome of destinazioni.destiznazioni) {
    await client.sql`
      INSERT INTO destinazioni (nome)
      VALUES (${nome})
      ON CONFLICT (nome) DO NOTHING;
    `;
  }
}
const seedFornitori = async () => {
  for (const nome of fornitori.fornitori) {
    await client.sql`
      INSERT INTO fornitori (nome)
      VALUES (${nome})
      ON CONFLICT (nome) DO NOTHING;
    `;
  }
}
const seedClienti = async () => {
  for (const cliente of clienti.clienti) {
    await client.sql`
      INSERT INTO clienti (nome, cognome, tel, email, tipo, provenienza, collegato, citta, note, data_di_nascita)
      VALUES (${cliente.nome}, ${cliente.cognome}, ${cliente.tel}, ${cliente.email}, ${cliente.tipo}, ${cliente.provenienza}, ${cliente.collegato}, ${cliente.citta}, ${cliente.note}, ${cliente.data_di_nascita})
      ON CONFLICT (nome, cognome) DO NOTHING;
    `;
  }
}
const seed = async () => {
  await createTableDestinazioni();
  await createTableClienti();
  await createTableFornitori();
  await createTablePreventivi();
  await createTableServiziATerra();
  await createTableVoli();
  await createTableAssicurazioni();
  await createTablePreventivoMostrareCliente();
  await createTablePartecipanti();
  await createTableIncassiPartecipanti();
  await createTablePagamentiServiziATerra();
  await createTablePagamentiVoli();
  await createTablePagamentiAssicurazioni();
  await createTablePratiche();

  // Seed initial data
  await seedDestinazioni();
  await seedFornitori();
  await seedClienti(); // test data
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seed();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}