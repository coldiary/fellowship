import { contractAdresses, proxyAddress } from 'config';
import { ContractInfo } from 'types/Contract';

const getContractEndpoint = (address: string): string => {
    switch (address) {
        case contractAdresses.tips: return `${proxyAddress}/tips/contract`;
        default: throw new Error('Contract address not defined in config');
    }
};

export async function fetchContractInfo(address: string): Promise<ContractInfo | undefined> {
    if (!address) return undefined;
    const res = await fetch(getContractEndpoint(address));
    const data = await res.json();
    return data;
}
