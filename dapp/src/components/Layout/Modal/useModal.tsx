import { useState } from 'react';

export type UseModalType = [
    shown: boolean,
    open: () => void,
    close: () => void,
    toggle: () => void,
]

export function useModal(): UseModalType {
    const [shown, setShown] = useState(false);

    const open = () => setShown(true);
    const close = () => setShown(false);
    const toggle = () => shown ? close() : open();

    return [shown, open, close, toggle];
}
