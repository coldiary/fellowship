import React, { FC, PropsWithChildren, useState } from 'react';
import { Popover } from 'react-tiny-popover';

import { ReactComponent as CloseIcon } from 'assets/img/close.svg';
import { primaryButton, secondaryButton } from 'components/styles';

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

interface ModalProps {
    shown: boolean;
    closeModal: () => void;
    content: () => JSX.Element;
    toggle: () => JSX.Element;
}

export const Modal: FC<ModalProps> = ({ shown, closeModal, content, toggle }) => {
    return (
        <Popover
            isOpen={shown}
            containerStyle={{ width: '100vw', height: '100vh', position: 'absolute' }}
            contentLocation={{ top: 0, left: 0 }}
            content={
                <div className='absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center' >
                    <div className='bg-white border shadow-md rounded-md relative max-w-screen-sm'>
                        <button className='absolute top-2 right-2' onClick={closeModal}>
                            <CloseIcon className='w-5' />
                        </button>
                        {content()}
                    </div>
                </div>
            }
        >
            {toggle()}
        </Popover>
    );
};

interface ConfirmModalProps {
    shown: boolean;
    content: () => JSX.Element;
    closeModal: (confirm: boolean) => void;
    toggle: () => JSX.Element;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({ shown, closeModal, toggle, content }) => {
    return (
        <Popover
            isOpen={shown}
            containerStyle={{ width: '100vw', height: '100vh', position: 'absolute' }}
            contentLocation={{ top: 0, left: 0 }}
            content={
                <div className='absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center' >
                    <div className='bg-white p-6 border shadow-md rounded-md relative max-w-screen-sm'>
                        <button className='absolute top-2 right-2' onClick={() => closeModal(false)}>
                            <CloseIcon className='w-5' />
                        </button>
                        {content()}
                        <div className="mt-6 flex flex-row gap-10 justify-evenly">
                            <button className={`${secondaryButton} flex-auto`} onClick={() => closeModal(true)}>Cancel</button>
                            <button className={`${primaryButton} flex-auto`} onClick={() => closeModal(true)}>Confirm</button>
                        </div>
                    </div>
                </div>
            }
        >
            {toggle()}
        </Popover>
    );
};
