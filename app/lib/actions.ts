'use server'; // IMPORTANTE: server actions devono essere precedute da 'use server' altrimenti bisogna dichiararlo per ciascuna!!

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
//import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true, customerName: true });

export async function createInvoice(formData: FormData) {

    try {const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

  await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`;

}
catch(error) {
  return {
    message: 'Database Error: Failed to Create Invoice.',
  };
}

revalidatePath('/dashboard/invoices');
redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  
  const data = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = data.amount * 100;
  
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${data.customerId}, amount = ${amountInCents}, status = ${data.status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
  revalidatePath('/dashboard/invoices');
}



/*export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}*/

export type State = {
  message?: string, 
  errors?: {
  name?: string[],
  email?: string[],
  password?: string[]
  },
  dbError?: string 
};


export async function createUser(prevState: State, formData: FormData) {
  
    const parsedData = z
    .object({
      name: z.string({invalid_type_error: 'Please enter a username'})
            .min(4, {message: 'The username should be at least 4 characters long'}),
      email: z.string({invalid_type_error: 'Please entre an email'})
              .email({message: 'Please enter an email'}),
      password: z.string({invalid_type_error: 'Please enter a password'})
                 .min(6, {message: 'The password should be at least 6 characters long'}),
    })
    .safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    });

    if (!parsedData.success) {
      return {
        ...prevState,
        errors: parsedData.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
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
      message: 'User created successfully'
    };
    } catch (error) {
      return {
      ...prevState,
      message: 'Database Error: Failed to Create User.',
      dbError: 'Database Error: Failed to Create User.'
    };
    }
}