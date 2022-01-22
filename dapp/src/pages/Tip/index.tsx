import React from 'react';
import { secondaryButton } from 'components/styles';

export const Tip = () => {
    return (
        <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto'>
            <div className="flex flex-row justify-between">
                <div className="text-4xl">Actives campaigns</div>
                <button className={secondaryButton}>Create campaign</button>
            </div>
        </div>
    );
};
