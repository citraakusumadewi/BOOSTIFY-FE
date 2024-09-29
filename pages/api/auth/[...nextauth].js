import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch('https://boostify-back-end.vercel.app/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assisstant_code: credentials?.username,
            password: credentials?.password,
          }),
        });

        if (!res.ok) {
          throw new Error('Invalid credentials');
        }

        const user = await res.json();
        if (user && user.token) {
          return user; // Return user with auth token
        }

        return null;
      }
    })
  ],
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token; // Auth token
        token.name = user.name;
        token.assistantCode = user.assistant_code;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        assistantCode: token.assistantCode,
        token: token.token, // Auth token
      };
      return session;
    }
  },
  pages: {
    signIn: '/SignIn',
    signOut: '/SignOut',
  }
});