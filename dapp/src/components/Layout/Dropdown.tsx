import React, { FC, PropsWithChildren, useState } from 'react';
import { Popover } from 'react-tiny-popover';

export type UseDropdownType = [
    shown: boolean,
    open: () => void,
    open: () => void,
]

export function useDropdown(): UseDropdownType {
    const [shown, setShown] = useState(false);

    const open = () => setShown(true);
    const close = () => setShown(false);

    return [shown, open, close];
}

interface DropdownProps {
    shown: boolean;
    closeDropdown: () => void;
    content: () => JSX.Element;
    toggle: () => JSX.Element;
}

export const Dropdown: FC<PropsWithChildren<DropdownProps>> = ({ shown, closeDropdown, content, toggle }) => {
    return (
        <Popover
            isOpen={shown}
            positions={['bottom', 'left']}
            padding={10}
            onClickOutside={closeDropdown}
            boundaryInset={20}
            content={
                <div className='bg-white border shadow-md rounded-md max-w-screen-md' onClick={e => e.stopPropagation()}>
                    {content()}
                </div>
            }
        >
            {toggle()}
        </Popover>
    );
};
