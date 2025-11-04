"use server";

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import connect from "@/db/db";
// import User from "@/models/user.model";
import OAuthUser from "@/models/oauthUser.model";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
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

        // const existing = await User.findOne({
        //   email: profile.email || user.email,
        // });

        // if (!existing) {
        //   await User.create({
        //     email: profile.email || user.email,
        //     username: profile.login || user.name,
        //   });
        // }

        return true;
      } catch (err) {
        console.error("NextAuth signIn callback error:", err);
        return false;
      }
    },

    async redirect({ url, baseUrl }: { url?: string; baseUrl?: string }) {
      try {
        if (!url) return `${baseUrl}/dashboard`;

        if (url.startsWith("/")) return `${baseUrl}${url}`;

        if (url.startsWith(baseUrl || "")) return url;

        return `${baseUrl}/dashboard`;
      } catch (err) {
        return `${baseUrl}/dashboard`;
      }
    },
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
