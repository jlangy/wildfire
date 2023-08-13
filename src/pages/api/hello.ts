import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        res.status(200).json({ message: 'Protected API Contents' })
    } else {
        res.status(401).json({message: 'Please login to view content'})
    }
}
