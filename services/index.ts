import dotenv from 'dotenv';
import express from 'express';
// import jarsAPI from '../api/jars'
import type { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();
const app = express();
const token = process.env.MONO || '';
const PORT = process.env.PORT || 5000;

app.use(express.json());

// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'ok' });
// });
//
// app.get('/user-info', async (req, res) => {
//     try {
//         const monoResponse = await http.get('/personal/client-info');
//         if (monoResponse.status !== 200) {
//             res.status(400).json({ message: monoResponse.statusText });
//             return;
//         }
//         res.status(200).json(monoResponse.data);
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ message: 'Something went wrong' });
//     }
// });
//
// app.get('/jars', (req, res) => jarsAPI(req as VercelRequest, res as unknown as VercelResponse));
//
// app.get('/top-donates', async (req, res) => {
//     try {
//         const { jarId, from, count = 5 } = req.query;
//         const monoResponse = await http.get(`/personal/statement/${jarId}/${from}`);
//         if (monoResponse.status !== 200) {
//             res.status(400).json({ message: monoResponse.statusText });
//             return;
//         }
//         const statements: Statement[] = monoResponse.data;
//         const topDonates = statements
//             .sort((a, b) => {
//                 return b.amount - a.amount;
//             })
//             .slice(0, Number(count));
//
//         return res.status(200).json({
//             donates: topDonates.map(_mapDonate),
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ message: 'Something went wrong' });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`);
});

// function _mapDonate(statement: Statement): Donate {
//     const { id, time, comment, amount } = statement;
//
//     return {
//         id,
//         time,
//         // TODO generate random comment if empty
//         comment: comment || 'Шикарний донат',
//         amount: `${amount / 100} UAH`,
//     };
// }
