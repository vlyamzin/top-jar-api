import axios, { AxiosInstance } from 'axios';

const setup = (token: string): AxiosInstance => {
    return axios.create({
        baseURL: 'https://api.monobank.ua',
        headers: {
            common: {
                'X-Token': token,
                'Content-type': 'application/json',
            },
        },
    });
};

export { setup };
