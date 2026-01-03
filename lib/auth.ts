import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "./supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id, email")
          .eq("email", user.email)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is fine
          console.error("Error fetching user:", fetchError);
          return false;
        }

        if (!existingUser) {
          // Create new user in Supabase - let Supabase generate the UUID
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              provider: account?.provider || "google",
              provider_account_id: account?.providerAccountId || user.id,
            })
            .select("id")
            .single();

          if (insertError) {
            console.error("Error creating user:", insertError);
            return false;
          }

          // Store the generated UUID for the JWT callback
          user.id = newUser.id;
        } else {
          // Update existing user info and store their UUID
          await supabase
            .from("users")
            .update({
              name: user.name,
              avatar_url: user.image,
              updated_at: new Date().toISOString(),
            })
            .eq("email", user.email);

          user.id = existingUser.id;
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        // Use the UUID stored in the token
        session.user.id = token.userId as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Store the Supabase UUID in the token
        token.userId = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
