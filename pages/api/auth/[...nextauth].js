// // pages/api/auth/[...nextauth].js
// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import { SupabaseAdapter } from '@next-auth/supabase-adapter';
// import supabase from '../../../src/supabaseServerClient'; // Adjust the path accordingly

// export default NextAuth({
// providers: [
//     GoogleProvider({
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     authorization: {
//         params: {
//         scope: 'openid profile email',
//         },
//     },
//     }),
// ],
// adapter: SupabaseAdapter({
//     url: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     secret: process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role key
// }),
// secret: process.env.NEXTAUTH_SECRET,
// pages: {
//     error: '/error', // Custom error page
// },
// callbacks: {
//     async session({ session, token }) {
//     session.user.id = token.sub;
//     return session;
//     },
// },
// });

// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
        params: {
        scope: 'openid profile email',
        },
    },
    }),
],
secret: process.env.NEXTAUTH_SECRET,
session: {
    strategy: 'jwt', // Use JSON Web Tokens for in-memory session storage
},
callbacks: {
    async session({ session, token }) {
    // Attach token to session for easy access to user ID
    session.user.id = token.sub;
    return session;
    },
    async jwt({ token, user }) {
    // Pass user ID from Google to the token
    if (user) {
        token.sub = user.id;
    }
    return token;
    },
},
debug: true, // Enable debugging to help troubleshoot issues
});