import NextAuth from "next-auth"
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"

export const authOptions = {
  providers: [
    DuendeIDS6Provider({
      clientId: "bff",
      clientSecret: "secret",
      issuer: "https://localhost:6001",
      authorization: { params: { scope: "ytc_api" } },
    })
  ]
}


export default NextAuth(authOptions)