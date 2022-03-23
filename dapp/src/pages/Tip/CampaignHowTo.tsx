import React, { FC } from 'react';

import { ReactComponent as Page } from '../../assets/img/page.svg';
import { ReactComponent as Share } from '../../assets/img/share.svg';
import { ReactComponent as Transfer } from '../../assets/img/transfer.svg';

interface Props {
    closeModal: () => void,
}

export const CampaignHowTo: FC<Props> = () => {
    return (
        <div className="p-2 md:p-6 flex flex-col gap-10 md:gap-20">
            <div className="text-2xl uppercase font-bold opacity-70 text-center">Collect tips from your supporters</div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <Page className='w-48 md:w-full h-full'/>
                <div>
                    <div className="text-xl font-medium mb-6">Step 1 - Create a campaign</div>
                    <p>You can create your own page. Describe your activity and the currency you want to receive</p>
                </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-12">
                <div>
                    <div className="text-xl font-medium mb-6">Step 2 - Share your campaign</div>
                    <p>Your newly created campaign has a unique link that you can now share with you supporters in order for them to participage.</p>
                </div>
                <Share className='w-48 md:w-full h-full'/>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <Transfer className='w-48 md:w-full h-full'/>
                <div>
                    <div className="text-xl font-medium mb-6">Step 3 - Claim funds </div>
                    <p>{'You can claim whenever you like. You\'ll be able to close it when you no longer need it.'}</p>
                </div>
            </div>
        </div>
    );
};
