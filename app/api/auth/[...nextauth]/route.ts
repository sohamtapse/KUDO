"use server";

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import connect from "@/db/db";
import OAuthUser from "@/models/oauthUser.model";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email repo admin:repo_hook",
          // required to create webhooks automatically
        },
      },
    }),
  ],

  callbacks: {
    // 🔥 Save user to your MongoDB
    async signIn({ user, account, profile }: any) {
      try {
        await connect();

        await OAuthUser.findOneAndUpdate(
          { provider: account.provider, providerId: profile.id },
          {
            provider: account.provider,
            providerId: profile.id,
            email: profile.email || user.email,
            username: profile.login || user.name || user.email?.split("@")[0],
            image: profile.avatar_url || user.image,
          },
          { upsert: true, new: true }
        );

        return true;
      } catch (err) {
        console.error("NextAuth signIn callback error:", err);
        return false;
      }
    },

    // 🔥 Add access token to JWT (required for creating webhooks)
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // ⬅ important
      }
      return token;
    },

    // 🔥 Make accessToken available in session.client side
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (!url) return `${baseUrl}/dashboard`;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
