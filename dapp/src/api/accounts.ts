import { apiAddress } from 'config';
import { Account } from 'types/Account';

export const getAddressForHerotag = async (herotag: string): Promise<string | undefined> => {
    if (!herotag) return undefined;
    const res = await fetch(`${apiAddress}/usernames/${herotag}`);
    const data = await res.json() as Account;
    return data?.address;
};
