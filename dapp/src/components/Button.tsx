import React, { FC, forwardRef, MouseEventHandler, useMemo } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { uniqueId } from 'lodash';
import ReactTooltip from 'react-tooltip';

import { primaryButton, secondaryButton } from './styles';

interface Props {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    onlyAuth?: boolean;
    type?: 'primary' | 'secondary';
}

export const Button: FC<Props> = forwardRef(({ onClick, onlyAuth, children, type = 'primary' }, _) => {
    const { address } = useGetAccountInfo();
    const tooltipId = useMemo(() => uniqueId('tooltip-'), []);

    const disabled = useMemo(() => (!!onlyAuth && !address), [address, onlyAuth]);

    return (
        <>
            <button className={type === 'primary' ? primaryButton : secondaryButton} onClick={onClick}
                {...(disabled ? { 'data-tip': 'Connect wallet', 'data-for': tooltipId } : {})} disabled={disabled}
            >
                {children}
            </button>
            { disabled && <ReactTooltip id={tooltipId} place='bottom'/> }
        </>
    );
});
