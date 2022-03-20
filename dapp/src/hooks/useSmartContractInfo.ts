import useSWR from 'swr';

import { apiAddress } from 'config';
import { ContractInfo } from 'types/Contract';

const fetchContractInfo = async (address: string): Promise<ContractInfo | undefined> => {
    if (!address) return undefined;
    const res = await fetch(`${apiAddress}/accounts/${address}`);
    const data = await res.json();
    return data;
};

export default function useSmartContractInfo(contractAddress: string) {
    const { data: info } = useSWR(`contract-info-${contractAddress}`, fetchContractInfo);
    return info;
}
