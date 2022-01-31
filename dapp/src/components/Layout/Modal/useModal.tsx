import { useState } from 'react';

export type UseModalType = [
    shown: boolean,
    open: () => void,
    open: () => void,
]

export function useModal(): UseModalType {
    const [shown, setShown] = useState(false);

    const open = () => setShown(true);
    const close = () => setShown(false);

    return [shown, open, close];
}
