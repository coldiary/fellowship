import { proxyAddress } from 'config';

export const getAllCampaigns = async () => {
    const res = await fetch(`${proxyAddress}/tips/get-all-campaigns`);
    const data = await res.json();
    return data;
};
