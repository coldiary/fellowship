import React, { FC } from 'react';
import { Popover } from 'react-tiny-popover';
import { ReactComponent as CloseIcon } from 'assets/img/close.svg';

export interface ModalProps {
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
            content={<div className='absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center p-6 lg:p-0'>
                <div className='bg-white border shadow-md rounded-md relative h-full md:h-auto md:max-h-full w-full lg:max-w-screen-sm lg:max-h-9/10'>
                    <button className='absolute top-2 right-2' onClick={closeModal}>
                        <CloseIcon className='w-5' />
                    </button>
                    <div className="h-full w-full p-6 overflow-scroll">
                        {content()}
                    </div>
                </div>
            </div>}
        >
            {toggle()}
        </Popover>
    );
};
