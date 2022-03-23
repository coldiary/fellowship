import React, { FC, forwardRef, MouseEventHandler, useMemo } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { uniqueId } from 'lodash';
import ReactTooltip from 'react-tooltip';

import { clearButton, primaryButton, secondaryButton } from './styles';

type ButtonType =
    | 'primary'
    | 'secondary'
    | 'clear'
;
interface Props {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    onlyAuth?: boolean;
    type?: ButtonType;
}

export const Button: FC<Props> = forwardRef(({ onClick, onlyAuth, children, type = 'primary' }, _) => {
    const { address } = useGetAccountInfo();
    const tooltipId = useMemo(() => uniqueId('tooltip-'), []);

    const disabled = useMemo(() => (!!onlyAuth && !address), [address, onlyAuth]);

    const buttonStyle = useMemo(() => {
        switch (type) {
            case 'primary': return primaryButton;
            case 'secondary': return secondaryButton;
            case 'clear': return clearButton;
        }
    }, [type]);

    return (
        <>
            <button className={buttonStyle} onClick={onClick}
                {...(disabled ? { 'data-tip': 'Connect wallet', 'data-for': tooltipId } : {})} disabled={disabled}
            >
                {children}
            </button>
            { disabled && <ReactTooltip id={tooltipId} place='bottom'/> }
        </>
    );
});
