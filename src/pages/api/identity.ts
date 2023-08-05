import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  data: Array<{type: string, value: string}>
} | {message: string};

const identity = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    var result = await fetch(`${process.env.NEXT_YTC_API}/Identity`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (result.ok) {
      let data = await result.json();
      res.status(result.status).json({ data: data });
    } else {
      res.status(401).json({message: 'UnAuthorized'});
    }
  } else {
    res.status(401).json({message: 'UnAuthorized'});
  }
}

export default identity;