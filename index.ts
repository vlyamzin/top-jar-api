import * as dotenv from 'dotenv';
import express from 'express';
import { setup } from './http-client';

dotenv.config();
const app = express();
const token = process.env.MONO || '';
const PORT = 5000;
const http = setup(token);

app.use(express.json());

app.get('/user-info', async (req, res, next) => {
    try {
        const monoResponse = await http.get('/personal/client-info');
        console.log(monoResponse.status);
        if (monoResponse.status !== 200) {
            res.status(400).json({ message: 'Something went wrong' });
            return;
        }
        res.status(200).json(monoResponse.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`);
});
