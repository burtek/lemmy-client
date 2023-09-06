import { LemmyHttp } from 'lemmy-js-client';


let client: null | LemmyHttp;

export const createClient = (instance: string) => {
    client = new LemmyHttp(instance);
    return client;
};
export const getClient = () => client;
