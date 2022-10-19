import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setup } from '../services/http-client';

const token = process.env.MONO || '';
const http = setup(token);

export default async function (req: VercelRequest, res: VercelResponse) {
    try {
        const monoResponse = await http.get('/personal/client-info');
        if (monoResponse.status !== 200) {
            res.status(400).json({ message: monoResponse.statusText });
            return;
        }
        res.status(200).json(monoResponse.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Something went wrong' });
    }
}
