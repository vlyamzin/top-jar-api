import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setup } from '../services/http-client';
import { Statement } from '../definition/statement.type';
import { Donate } from '../definition/donate.type';

const token = process.env.MONO || '';
const http = setup(token);

export default async function (req: VercelRequest, res: VercelResponse) {
    try {
        const { jarId, from, count = 5 } = req.query;
        const monoResponse = await http.get(`/personal/statement/${jarId}/${from}`);
        if (monoResponse.status !== 200) {
            res.status(400).json({ message: monoResponse.statusText });
            return;
        }
        const statements: Statement[] = monoResponse.data;
        const topDonates = statements
            .sort((a, b) => {
                return b.amount - a.amount;
            })
            .slice(0, Number(count));

        return res.status(200).json({
            donates: topDonates.map(_mapDonate),
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Something went wrong' });
    }
}

function _mapDonate(statement: Statement): Donate {
    const { id, time, comment, amount } = statement;

    return {
        id,
        time,
        // TODO generate random comment if empty
        comment: comment || 'Шикарний донат',
        amount: `${amount / 100} UAH`,
    };
}
