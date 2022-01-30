import React, { FC } from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { Link } from 'react-router-dom';
import Truncate from 'react-truncate';

import { ReactComponent as Loader } from 'assets/img/loader.svg';
import { Campaign } from 'types/Tips';
import { useCampaign } from './useCampaign';

interface Props {
    campaign: Campaign;
}

export const CampaignCard: FC<Props> = ({ campaign }) => {
    const [, metadata, illustrationUri] = useCampaign({ campaign });

    return (
        <div className='border bg-white rounded-md overflow-hidden transition ease-in-out transform hover:scale-105 cursor-pointer'>
            { !metadata ? (
                <div className="flex items-center justify-between p-6">
                    <Loader className='m-auto w-10'/>
                </div>
            ) : (
                <Link to={`${campaign.id}`} className='hover:text-main'>
                    <img className='h-32 w-full object-cover' src={illustrationUri ?? ''} />
                    <div className="p-6">
                        <div className="mb-4 flex flex-row justify-between items-center">
                            <div className="text-xl">{metadata.title}</div>
                            <DappUI.Denominate value={campaign.amount} denomination={18} />
                        </div>
                        <p className='text-sm text-gray-500'>
                            <Truncate lines={3}>{metadata.description}</Truncate>
                        </p>
                    </div>
                </Link>
            )}
        </div>
    );
};
