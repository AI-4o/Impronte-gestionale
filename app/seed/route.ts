import { Pool } from 'pg';
import destinazioni from './destinazioni.json';
import fornitori from './fornitori.json';
import clienti from './clienti.json';
import banche from './banche.json';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.POSTGRESS_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

 
const createTableDestinazioni = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS destinazioni (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         nome VARCHAR(255) NOT NULL,
         UNIQUE (nome)
      );
    `);
}
const createTableBanche = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS banche (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         nome VARCHAR(255) NOT NULL,
         UNIQUE (nome)
      );
    `);
}
const createTableClienti = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS clienti (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         nome VARCHAR(255),
         cognome VARCHAR(255),
         tel VARCHAR(20),
         indirizzo VARCHAR(255),
         CAP VARCHAR(10),
         citta VARCHAR(255),
         CF VARCHAR(16),
         email VARCHAR(255) NOT NULL,
         tipo VARCHAR(20) CHECK (tipo IN ('PRIVATO', 'AGENZIA VIAGGI', 'AZIENDA')),
         provenienza VARCHAR(20) CHECK (provenienza IN ('Passaparola', 'Sito IWS', 'Sito INO', 'Telefono', 'Email Diretta', 'Sito ISE')),
         collegato VARCHAR(255),
         note TEXT,
         data_di_nascita DATE,
         UNIQUE (email)
      );
    `);
}
const createTableFornitori = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS fornitori (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         nome VARCHAR(255) NOT NULL,
         valuta VARCHAR(10),
         UNIQUE (nome)
      );
    `);
}
const createTablePreventivi = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS preventivi (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_cliente UUID NOT NULL REFERENCES clienti(id),
        percentuale_ricarico FLOAT,
        note TEXT,
         brand VARCHAR(255),
         adulti INT,
         bambini INT,
         riferimento VARCHAR(255),
         data_partenza DATE,
         operatore VARCHAR(255),
         feedback TEXT,
         stato VARCHAR(20) CHECK (stato IN ('da fare', 'in trattativa', 'confermato', 'inviato')),
         data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         numero_preventivo VARCHAR(255),
         UNIQUE (numero_preventivo)
      );
    `);
}
const createTableServiziATerra = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS servizi_a_terra (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_fornitore UUID REFERENCES fornitori(id),
         id_destinazione UUID REFERENCES destinazioni(id),
         descrizione TEXT,
         data DATE,
         numero_notti INT,
         numero_camere INT,
         totale FLOAT,
         valuta VARCHAR(10),
         cambio FLOAT,
         servizio_aggiuntivo BOOLEAN
      );
    `);
}
const createTableVoli = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS voli (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_fornitore UUID REFERENCES fornitori(id),
         compagnia_aerea VARCHAR(255),
         descrizione TEXT,
         data_partenza DATE,
         data_arrivo DATE,
         totale FLOAT,
         ricarico FLOAT,
         numero INT,
         valuta VARCHAR(10),
         cambio FLOAT
      );
    `);

}
const createTableAssicurazioni = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS assicurazioni (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_fornitore UUID REFERENCES fornitori(id),
         assicurazione VARCHAR(255),
         netto FLOAT,
         ricarico FLOAT,
         numero INT
      );
    `);
}
const createTablePreventiviAlCliente = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS preventivi_al_cliente (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID REFERENCES preventivi(id),
         descrizione_viaggio TEXT
      );
    `);
}
const createTablePreventiviAlClienteRow = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS preventivi_al_cliente_row (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo_al_cliente UUID NOT NULL REFERENCES preventivi_al_cliente(id),
         senza_assicurazione BOOLEAN,
         destinazione VARCHAR(255),
         descrizione TEXT,
         individuale FLOAT,
         numero INT
      );
    `);
}
const createTablePartecipanti = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS partecipanti (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         nome VARCHAR(255),
         cognome VARCHAR(255),
         tot_quota FLOAT
      );
    `);
}
const createTableIncassiPartecipanti = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS incassi_partecipanti (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_partecipante UUID NOT NULL REFERENCES partecipanti(id),
         id_banca UUID REFERENCES banche(id),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `);
} 
const createTablePagamentiServiziATerra = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS pagamenti_servizi_a_terra (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_servizio_a_terra UUID NOT NULL REFERENCES servizi_a_terra(id),
         id_banca UUID REFERENCES banche(id),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `);
}
const createTablePagamentiVoli = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS pagamenti_voli (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_volo UUID NOT NULL REFERENCES voli(id),
         id_banca UUID REFERENCES banche(id),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `);
}
const createTablePagamentiAssicurazioni = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS pagamenti_assicurazioni (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_assicurazione UUID NOT NULL REFERENCES assicurazioni(id),
         id_banca UUID REFERENCES banche(id),
         importo FLOAT,
         data_scadenza DATE,
         data_incasso DATE
      );
    `);
}
const createTablePratiche = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS pratiche (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         id_preventivo UUID NOT NULL REFERENCES preventivi(id),
         id_cliente UUID REFERENCES clienti(id),
         data_conferma DATE,
         data_partenza DATE,
         data_rientro DATE,
         note TEXT,
         numero_passeggeri INT,
         totale FLOAT
      );
    `);
}
const createTableUsers = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         email VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL,
         UNIQUE (email)
      );
    `);
}

const seedDestinazioni = async () => {
  for (const nome of destinazioni.destinazioni) {
    await pool.query(`
      INSERT INTO destinazioni (nome)
      VALUES ($1)
      ON CONFLICT (nome) DO NOTHING`, [nome]);
  }
}
const seedFornitori = async () => {
  for (const nome of fornitori.fornitori) {
    await pool.query(`
      INSERT INTO fornitori (nome)
      VALUES ($1)
      ON CONFLICT (nome) DO NOTHING`, [nome]);
  }
}
const seedClienti = async () => {
  for (const cliente of clienti.clienti) {
    await pool.query(`
      INSERT INTO clienti (nome, cognome, tel, email, tipo, provenienza, collegato, citta, note, data_di_nascita)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (email) DO NOTHING`, [cliente.nome, cliente.cognome, cliente.tel, cliente.email, cliente.tipo, cliente.provenienza, cliente.collegato, cliente.citta, cliente.note, cliente.data_di_nascita]);
  }
}
const seedBanche = async () => {
  for (const banca of banche.banche) {
    await pool.query(`
      INSERT INTO banche (nome) VALUES ($1) ON CONFLICT (nome) DO NOTHING`, [banca]);
  }
}
const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash('2NkS$ncXs', 10);
  await pool.query(`
    INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`, ['impronte@esempio.safari', hashedPassword]);
}

/** Delete tables */
const deleteTables = async () => {
  await pool.query('DROP TABLE IF EXISTS users CASCADE');
  await pool.query('DROP TABLE IF EXISTS pratiche CASCADE');
  await pool.query('DROP TABLE IF EXISTS pagamenti_assicurazioni CASCADE');
  await pool.query('DROP TABLE IF EXISTS pagamenti_voli CASCADE');
  await pool.query('DROP TABLE IF EXISTS pagamenti_servizi_a_terra CASCADE');
  await pool.query('DROP TABLE IF EXISTS incassi_partecipanti CASCADE');
  await pool.query('DROP TABLE IF EXISTS partecipanti CASCADE');
  await pool.query('DROP TABLE IF EXISTS preventivi_al_cliente CASCADE');
  await pool.query('DROP TABLE IF EXISTS preventivi_mostrare_cliente CASCADE');
  await pool.query('DROP TABLE IF EXISTS assicurazioni CASCADE');
  await pool.query('DROP TABLE IF EXISTS voli CASCADE');
  await pool.query('DROP TABLE IF EXISTS servizi_a_terra CASCADE');
  await pool.query('DROP TABLE IF EXISTS preventivi CASCADE');
  await pool.query('DROP TABLE IF EXISTS clienti CASCADE');
  await pool.query('DROP TABLE IF EXISTS banche CASCADE');
  await pool.query('DROP TABLE IF EXISTS fornitori CASCADE');
  await pool.query('DROP TABLE IF EXISTS destinazioni CASCADE');
}
/** Create tables */
const createTables = async () => {
  await createTableUsers();
  await createTableDestinazioni();
  await createTableBanche();
  await createTableClienti();
  await createTableFornitori();
  await createTablePreventivi();
  await createTableServiziATerra();
  await createTableVoli();
  await createTableAssicurazioni();
  await createTablePreventiviAlCliente();
  await createTablePreventiviAlClienteRow();
  await createTablePartecipanti();
  await createTableIncassiPartecipanti();
  await createTablePagamentiServiziATerra();
  await createTablePagamentiVoli();
  await createTablePagamentiAssicurazioni();
  await createTablePratiche();
}
/** Seed initial data */
const seedDb = async () => {
    await seedUsers();
    await seedDestinazioni();
    await seedFornitori();
    await seedBanche();
    await seedClienti();
}
export async function GET() {
  try {
    await pool.query('BEGIN');
    await deleteTables();
    await createTables();
    await seedDb();
    await pool.query('COMMIT');

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await pool.query('ROLLBACK');
    return Response.json({ error }, { status: 500 });
  }
}