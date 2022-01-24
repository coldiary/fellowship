import React, { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';

import { getAllCampaigns } from 'api/tips/getAllCampaigns';
import { ReactComponent as CloseIcon } from 'assets/img/close.svg';
import { ReactComponent as EmptyImg } from 'assets/img/empty.svg';
import { secondaryButton } from 'components/styles';
import { CreateCampaignModal } from './createCampaignModal';

export const Tip = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [creationModalShown, setCreationModalShown] = useState(false);

    const openCreationModal = () => setCreationModalShown(true);
    const closeCreationModal = () => setCreationModalShown(false);

    useEffect(() => {
        (async () => {
            setCampaigns(await getAllCampaigns());
        })().catch(console.error);
    }, []);

    return (
        <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto flex flex-col'>
            <div className="flex flex-row justify-between">
                <div className="text-4xl">Active campaigns</div>
                <Popover
                    isOpen={creationModalShown}
                    containerStyle={{ width: '100vw', height: '100vh', position: 'absolute' }}
                    contentLocation={{ top: 0, left: 0 }}
                    content={
                        <div className='absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center' >
                            <div className='bg-white border shadow-md rounded-md relative max-w-screen-sm'>
                                <button className='absolute top-2 right-2' onClick={closeCreationModal}>
                                    <CloseIcon className='w-5' />
                                </button>
                                <CreateCampaignModal />
                            </div>
                        </div>
                    }
                >
                    <button className={secondaryButton} onClick={openCreationModal}>Create campaign</button>
                </Popover>
            </div>
            { campaigns.length ? (
                <div></div>
            ) : (
                <div className='flex-auto flex justify-center items-center'>
                    <div className='flex flex-col gap-6 items-center justify-center'>
                        <EmptyImg className='w-40 h-auto'/>
                        <div className='text-2xl text-gray-500 font-medium'>No campaigns created yet</div>
                    </div>
                </div>
            )}
        </div>
    );
};
