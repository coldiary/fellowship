import React, { FC, useContext } from 'react';
import { ToastsContext } from 'contexts/Toasts';

export interface Toast {
    id: string;
    message: string;
}

export const ToastList: FC = () => {
    const { toasts } = useContext(ToastsContext);

    return (
        <div className={`${toasts.length ? 'bottom-4' : '-bottom-20'} transition-all fixed inset-x-4 bottom-4 flex flex-col justify-end gap-2`}>
            {toasts.map(t => <div key={t.id} className='bg-main text-white border rounded-md p-4'>{t.message}</div>)}
        </div>
    );
};
