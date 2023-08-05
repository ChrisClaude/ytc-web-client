import NextAuth from "next-auth"
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"

export const authOptions = {
  providers: [
    DuendeIDS6Provider({
      clientId: "ytc_web_client",
      clientSecret: "secret",
      wellKnown: 'https://localhost:6001/.well-known/openid-configuration',
      issuer: "https://localhost:6001",
      authorization: { params: { scope: "openid profile api1 ytc_api" } },
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, account, user}) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        return { accessToken: account.access_token, user: user }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.user = {...token.user}
      return session;
    }
  }
}



export default NextAuth(authOptions)