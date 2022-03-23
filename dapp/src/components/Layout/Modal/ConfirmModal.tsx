import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover } from 'react-tiny-popover';

import { ReactComponent as CloseIcon } from 'assets/img/close.svg';
import { primaryButton, secondaryButton } from 'components/styles';


export interface ConfirmModalProps {
    shown: boolean;
    content: () => JSX.Element;
    closeModal: (confirm: boolean) => void;
    toggle: () => JSX.Element;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({ shown, closeModal, toggle, content }) => {
    const { t } = useTranslation();
    return (
        <Popover
            isOpen={shown}
            containerStyle={{ width: '100vw', height: '100vh', position: 'absolute' }}
            contentLocation={{ top: 0, left: 0 }}
            content={<div className='absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center'>
                <div className='bg-white p-6 border shadow-md rounded-md relative max-w-screen-sm'>
                    <button className='absolute top-2 right-2' onClick={() => closeModal(false)}>
                        <CloseIcon className='w-5' />
                    </button>
                    {content()}
                    <div className="mt-6 flex flex-row gap-10 justify-evenly">
                        <button className={`${secondaryButton} flex-auto`} onClick={() => closeModal(true)}>{t('global.cancel')}</button>
                        <button className={`${primaryButton} flex-auto`} onClick={() => closeModal(true)}>{t('global.confirm')}</button>
                    </div>
                </div>
            </div>}
        >
            {toggle()}
        </Popover>
    );
};
