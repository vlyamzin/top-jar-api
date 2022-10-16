import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setup } from '../http-client';
import { Jar, JarBasic } from '../definition/jar.type';

const token = process.env.MONO || '';
const http = setup(token);

export default async function (req: VercelRequest, res: VercelResponse) {
    try {
        const monoResponse = await http.get('/personal/client-info');
        if (monoResponse.status !== 200) {
            res.status(400).json({ message: monoResponse.statusText });
            return;
        }
        const jars: Jar[] = monoResponse.data.jars;
        res.status(200).json({
            jars: jars.map((j): JarBasic => ({ id: j.id, title: j.title })),
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Something went wrong' });
    }
}
