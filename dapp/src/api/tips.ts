import { contractAdresses, proxyAddress } from 'config';
import { Campaign } from 'types/Tips';
import { formatPayload, sendTransaction } from 'utils/contract';

export const getCampaign = async (id: number) => {
    const res = await fetch(`${proxyAddress}/tips/campaign/${id}`);
    const data = await res.json() as Campaign;
    return data;
};

export const getAllCampaigns = async (): Promise<Campaign[]> => {
    const res = await fetch(`${proxyAddress}/tips/all`);
    const data = await res.json() as Campaign[];
    return data;
};

export const createCampaign = async (metadata_cid: string, token_identifier: string) => {
    return await sendTransaction([{
        value: '0',
        data: formatPayload('createCampaign', [
            { value: metadata_cid, targetType: 'ManagedBuffer' },
            { value: token_identifier, targetType: 'TokenIdentifier' },
        ]),
        receiver: contractAdresses.tips,
    }]);
};

export const updateCampaign = async (id: number, metadata_cid: string) => {
    return await sendTransaction([{
        value: '0',
        data: formatPayload('updateCampaign', [
            { value: id, targetType: 'Number' },
            { value: metadata_cid, targetType: 'ManagedBuffer' },
        ]),
        receiver: contractAdresses.tips,
    }]);
};

export const endCampaign = async (id: number) => {
    return await sendTransaction([{
        value: '0',
        data: formatPayload('endCampaign', [
            { value: id, targetType: 'Number' },
        ]),
        receiver: contractAdresses.tips,
    }]);
};

export const claimCampaign = async (id: number) => {
    return await sendTransaction([{
        value: '0',
        data: formatPayload('claimCampaign', [
            { value: id, targetType: 'Number' },
        ]),
        receiver: contractAdresses.tips,
    }]);
};

export const tipCampaign = async (id: number, amount: number) => {
    return await sendTransaction([{
        value: `${amount}`,
        data: formatPayload('tip', [
            { value: id, targetType: 'Number' },
        ]),
        receiver: contractAdresses.tips,
    }]);
};
