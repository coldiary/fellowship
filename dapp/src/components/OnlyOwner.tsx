import React, { FC, PropsWithChildren, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import useIsContractOwner from 'hooks/useIsContractOwner';

interface Props {
    contractAddress: string;
}

export const OnlyOwner: FC<PropsWithChildren<Props>> = ({ contractAddress, children }) => {
    const navigate = useNavigate();
    const isOwner = useIsContractOwner(contractAddress);

    useEffect(() => {
        if (!isOwner) navigate('/');
    }, [isOwner]);

    return (<>{children}</>);
};
