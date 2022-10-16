import * as dotenv from 'dotenv';
import express from 'express';
import { setup } from './http-client';
import { Jar, JarBasic } from './definition/jar.type';
import { Statement } from './definition/statement.type';
import { Donate } from './definition/donate.type';

dotenv.config();
const app = express();
const token = process.env.MONO || '';
const PORT = 5000;
const http = setup(token);

app.use(express.json());

app.get('/user-info', async (req, res) => {
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
});

app.get('/jars', async (req, res) => {
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
});

app.get('/top-donates', async (req, res) => {
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
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`);
});

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
