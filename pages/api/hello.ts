// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string,
  cookies: string,
  headers: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cookies = JSON.stringify(req.cookies);
  const headers = JSON.stringify(req.headers);
  res.status(200).json({ name: 'John Doe', cookies, headers})
}
