import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials) return null;

        if (
          credentials.username === "admin" &&
          credentials.password === "1234"
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@test.com",
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
});