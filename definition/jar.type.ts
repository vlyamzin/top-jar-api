export interface Jar {
    id: string;
    sendId: string;
    title: string;
    description: string;
    currencyCode: number;
    balance: number;
    goal: number | null;
}

export interface JarBasic extends Partial<Jar> {
    id: string;
    title: string;
}
