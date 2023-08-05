import NextAuth from "next-auth"
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"

export const authOptions = {
  providers: [
    DuendeIDS6Provider({
      clientId: "bff",
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
  ]
}


export default NextAuth(authOptions)