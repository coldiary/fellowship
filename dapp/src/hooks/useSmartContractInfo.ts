import { useState, useEffect } from 'react';

import { fetchContractInfo } from 'api/contracts';
import { ContractInfo } from 'types/Contract';

export default function useSmartContractInfo(contractAddress: string) {
    const [info, setInfo] = useState<ContractInfo | undefined>(undefined);

    useEffect(() => {
        (async () => {
            setInfo(await fetchContractInfo(contractAddress));
        })().catch(() => setInfo(undefined));
    }, []);

    return info;
}
