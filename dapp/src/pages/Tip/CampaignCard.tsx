import React, { FC, useContext, useMemo } from 'react';
import { DappUI } from '@elrondnetwork/dapp-core-components';
import { Link } from 'react-router-dom';
import Truncate from 'react-truncate';

import { ReactComponent as Loader } from 'assets/img/loader.svg';
import { TokensContext } from 'contexts/Tokens';
import { Campaign } from 'types/Tips';
import { useCampaign } from './useCampaign';

interface Props {
    campaign: Campaign;
}

export const CampaignCard: FC<Props> = ({ campaign }) => {
    const [, metadata, illustrationUri] = useCampaign({ campaign });
    const { get } = useContext(TokensContext);

    const token = useMemo(() => {
        return get(campaign.token_identifier);
    }, []);

    return (
        <div className='border bg-white rounded-md overflow-hidden transition ease-in-out transform hover:scale-105 cursor-pointer'>
            { !metadata ? (
                <div className="flex items-center justify-between p-6">
                    <Loader className='m-auto w-10'/>
                </div>
            ) : (
                <Link to={`${campaign.id}`} className='h-full flex flex-col hover:text-main'>
                    <img className='h-32 w-full object-cover' src={illustrationUri ?? ''} />
                    <div className="flex-auto p-6 flex flex-col">
                        <div className="mb-4 flex flex-row justify-between items-center">
                            <div className="text-xl">{metadata.title}</div>
                        </div>
                        <p className='text-sm text-gray-500'>
                            <Truncate lines={3}>{metadata.description}</Truncate>
                        </p>
                        <div className="flex-auto"></div>
                        <div className="mt-4 flex flex-row justify-end">
                            <DappUI.Denominate value={campaign.amount} token={token?.name ?? '-'} decimals={2} denomination={token?.decimals ?? 18} />
                        </div>
                    </div>
                </Link>
            )}
        </div>
    );
};
