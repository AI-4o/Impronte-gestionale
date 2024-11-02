import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {   
         
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl)); // redirect the user to the dashboard
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`; // Adjust redirect as needed
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;