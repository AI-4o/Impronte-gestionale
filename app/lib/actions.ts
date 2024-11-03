"use server"; // IMPORTANTE: server actions devono essere precedute da 'use server' altrimenti bisogna dichiararlo per ciascuna!!

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "../../auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { Cliente } from "./definitions";

// Utility type to transform properties into string[]
export type TransformToStringArray<T> = {
  [K in keyof T]: string[];
};
export type State<A> = {
  message?: string;
  values?: Partial<A>;
  errors?: Partial<TransformToStringArray<A>>;
  dbError?: string;
};

export type InvoiceState = State<{
  customerId: string;
  amount: string;
  status: string;
}>;

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z
    .string()
    .min(4, { message: "customer name should be at least 4 characters long" }),
  amount: z.coerce
    .number({ message: "invalid format" })
    .gt(0, "amount must be greater than zero!"),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

// ### DELETE GENERAL ENTITY ###
export const deleteEntity = async (id: string, entityTableName: string) => {
  console.log("action deleteEntity", { id, entityTableName });
  // Construct the query string with the validated table name
  const queryText = `DELETE FROM ${entityTableName} WHERE id = $1`;
  // Execute the query with parameterized id
  await sql.query(queryText, [id]);
  revalidatePath(`/dashboard/${entityTableName}`);
};


// ### CLIENTI ###
const ClienteSchema = z.object({
  id: z.string(),
  nome: z.string(),
  cognome: z.string(),
  note: z.string(),
  tipo: z.enum(["PRIVATO", "AGENZIA VIAGGI", "AZIENDA"]),
  data_di_nascita: z.string().date(),
  email: z.string().email(),
  citta: z.string(),
  collegato: z.string(),
  tel: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, {
      message: "telefono must be in international format",
    }), // add control
  provenienza: z.enum([
    "Passaparola",
    "Sito IWS",
    "Sito INO",
    "Telefono",
    "Email Diretta",
    "Sito ISE",
  ]),
});
export type ClienteState = State<Cliente>;
export const createCliente = async (
  prevState: ClienteState,
  formData: FormData
) => {
  console.log("action createCliente", {
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });

  const parsedData = ClienteSchema.omit({ id: true }).safeParse({
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  try {
    await sql`
    INSERT INTO clienti (nome, cognome, note, tipo, data_di_nascita, tel, email, citta, collegato, provenienza)
    VALUES (
    ${parsedData.data.nome}, 
    ${parsedData.data.cognome}, 
    ${parsedData.data.note}, 
    ${parsedData.data.tipo}, 
    ${parsedData.data.data_di_nascita}, 
    ${parsedData.data.tel}, 
    ${parsedData.data.email}, 
    ${parsedData.data.citta},
    ${parsedData.data.collegato},
    ${parsedData.data.provenienza})
    ON CONFLICT (nome, cognome) DO NOTHING;
  `;
  } catch (error) {
    console.log("db error: ", error);
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath("/dashboard/clienti");
  redirect("/dashboard/clienti");
};

export const updateCliente = async (
  prevState: ClienteState,
  formData: FormData
) => {

  console.log('prevState: ', prevState);
  console.log("action updateCliente", {
    id: prevState,
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });

  const parsedData = ClienteSchema.omit({ id: true }).safeParse({
    nome: formData.get("nome"),
    cognome: formData.get("cognome"),
    note: formData.get("note"),
    tipo: formData.get("tipo"),
    data_di_nascita: formData.get("data_di_nascita"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    citta: formData.get("citta"),
    collegato: formData.get("collegato"),
    provenienza: formData.get("provenienza"),
  });
  if (!parsedData.success) {
    console.log("parsedData.error", parsedData.error);
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  try {
    await sql`
    UPDATE clienti SET 
    nome = ${parsedData.data.nome}, 
    cognome = ${parsedData.data.cognome}, 
    note = ${parsedData.data.note}, 
    tipo = ${parsedData.data.tipo}, 
    data_di_nascita = ${parsedData.data.data_di_nascita}, 
    tel = ${parsedData.data.tel}, 
    email = ${parsedData.data.email}, 
    citta = ${parsedData.data.citta}, 
    collegato = ${parsedData.data.collegato}, 
    provenienza = ${parsedData.data.provenienza}
    WHERE id = ${prevState.values?.id}
    `;
  } catch (error) {
    console.log("db error: ", error);
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath("/dashboard/clienti");
  redirect("/dashboard/clienti");
};

// ### INVOICES ###
const InvoiceSchema = FormSchema.omit({
  id: true,
  date: true,
  customerName: true,
});

export async function createInvoice(
  prevState: InvoiceState,
  formData: FormData
) {
  const parsedData = InvoiceSchema.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      values: parsedData.data,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  const amountInCents = parsedData.data.amount * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${parsedData.data.customerId}, ${amountInCents}, ${parsedData.data.status}, ${date})
  `;
  } catch (error) {
    return {
      ...prevState,
      values: parsedData.data,
      dbError: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
export async function updateInvoice(
  prevState: InvoiceState & { id: string },
  formData: FormData
) {
  const parsedData = InvoiceSchema.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!parsedData.success) {
    return {
      ...prevState,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  const amountInCents = parsedData.data.amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${parsedData.data.customerId}, amount = ${amountInCents}, status = ${parsedData.data.status}
      WHERE id = ${prevState.id}
    `;
  } catch (error) {
    return {
      ...prevState,
      dbError: "Database Error: Failed to update invoice.",
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
  revalidatePath("/dashboard/invoices");
}

/** AUTHENTICATION */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function createUser(
  prevState: State<{ name?: string[]; email?: string[]; password?: string[] }>,
  formData: FormData
) {
  const parsedData = z
    .object({
      name: z
        .string({ invalid_type_error: "Please enter a username" })
        .min(4, {
          message: "The username should be at least 4 characters long",
        }),
      email: z
        .string({ invalid_type_error: "Please entre an email" })
        .email({ message: "Please enter an email" }),
      password: z
        .string({ invalid_type_error: "Please enter a password" })
        .min(6, {
          message: "The password should be at least 6 characters long",
        }),
    })
    .safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!parsedData.success) {
    return {
      ...prevState,
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  try {
    await sql`
    INSERT INTO users (name, email, password)
    VALUES (${parsedData.data.name}, ${parsedData.data.email}, ${hashedPassword})
  `;
    return {
      ...prevState,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      ...prevState,
      message: "Database Error: Failed to Create User.",
      dbError: "Database Error: Failed to Create User.",
    };
  }
}
