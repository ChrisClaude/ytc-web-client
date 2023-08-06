import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import DuendeIDS6Provider, { DuendeISUser } from 'next-auth/providers/duende-identity-server6';
import { OAuthUserConfig } from 'next-auth/providers/oauth';
import cookie from 'cookie';

export const nextAuthOptions = (req: NextApiRequest, res: NextApiResponse<OAuthUserConfig<DuendeISUser>>) => {
  return {
    providers: [
      DuendeIDS6Provider({
        clientId: 'ytc_web_client',
        clientSecret: 'secret',
        wellKnown: 'https://localhost:6001/.well-known/openid-configuration',
        issuer: 'https://localhost:6001',
        authorization: { params: { scope: 'openid profile api1 ytc_api' } },
        idToken: true,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: null,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account, user }: {token: any, account: any, user: any}) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          return { accessToken: account.access_token, user: user };
        }
        return token;
      },
      async session({ session, token }: { session: any, token: any }) {
        // Send properties to the client, like an access_token from a provider.
        res.setHeader('Set-Cookie', cookie.serialize('token', token.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: 'strict',
          path: '/'
        }))
        let userInfoRes = await fetch(`${process.env.IDENTITY_SERVICE_ENDPOINT}/connect/userinfo`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        let userInfo = await userInfoRes.json();
        session.user = { ...token.user, ...userInfo };
        return session;
      },
    },
  };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<any>) => {
  return NextAuth(req, res, nextAuthOptions(req, res))
};
