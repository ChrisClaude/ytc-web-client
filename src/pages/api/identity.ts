import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "./auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';

type ResponseData = {
  data: Array<{type: string, value: string}>
} | {message: string};

const identity = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getServerSession(req, res, nextAuthOptions(req, res));

  if (req.method !== 'GET') {
    res.status(400).json({message: 'Request method not supported'});
  }

  if (!session.user || !req.headers.cookie) {
    res.status(401).json({message: 'UnAuthorized'});
  }

  const { token } = cookie.parse(req.headers.cookie as string);
  console.log('token from cookie', token);
  var result = await fetch(`${process.env.NEXT_YTC_API}/Identity`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (result.ok) {
    let data = await result.json();
    res.status(result.status).json({ data: data });
  } else {
    res.status(401).json({message: 'UnAuthorized'});
  }

}

export default identity;