import React, { useEffect, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

import { getAllCampaigns } from 'api/tips/getAllCampaigns';
import { ReactComponent as EmptyImg } from 'assets/img/empty.svg';
import { Modal, useModal } from 'components/Layout/Modal';
import { secondaryButton } from 'components/styles';
import { contractAdresses } from 'config';
import useIsContractOwner from 'hooks/useIsContractOwner';
import { Campaign, CampaignStatus } from 'types/Tips';
import { CampaignCard } from './Campaign_Card';
import { CreateCampaignModal } from './CreateCampaignModal';

export type SortedCampaigns = [own: Campaign[], active: Campaign[], ended: Campaign[]];

export const TipList = () => {
    const { address } = useGetAccountInfo();
    const isOwner = useIsContractOwner(contractAdresses.tips);
    const [campaigns, setCampaigns] = useState([[], [], []] as SortedCampaigns);
    const [
        creationModalShown, openCreationModal, closeCreationModal
    ] = useModal();

    useEffect(() => {
        (async () => {
            const all = await getAllCampaigns();
            const sorted = all.reduce<SortedCampaigns>((acc, c) => {
                acc[c.creator_address === address ? 0 : (c.status === CampaignStatus.Active ? 1 : 2)].push(c);
                return acc;
            }, [[], [], []]);
            sorted[0].sort((a) => a.status === CampaignStatus.Ended ? 1 : -1);
            setCampaigns(sorted);
        })().catch(console.error);
    }, []);

    return (
        <div className='max-w-screen-2xl mx-auto p-10 w-full flex-auto flex flex-col gap-6'>
            <div className='flex-auto'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-4xl">My campaigns</div>
                    <Modal shown={creationModalShown} closeModal={closeCreationModal}
                        content={() => <CreateCampaignModal />}
                        toggle={() => (<button className={secondaryButton} onClick={openCreationModal}>Create campaign</button>)}>
                    </Modal>
                </div>
                {campaigns[0].length ? (
                    <div className="grid grid-cols-4 gap-6">
                        {campaigns[0].map(c => <CampaignCard campaign={c} key={c.id} />)}
                    </div>
                ) : (
                    <div className='flex-auto flex justify-center items-center'>
                        <div className='flex flex-col gap-6 items-center justify-center'>
                            <EmptyImg className='w-40 h-auto' />
                            <div className='text-2xl text-gray-500 font-medium'>No campaigns created yet</div>
                        </div>
                    </div>
                )}
            </div>
            { isOwner && (
                <>
                    <div className='flex-auto'>
                        <div className="flex flex-row justify-between mb-6">
                            <div className="text-4xl">Active campaigns</div>
                        </div>
                        {campaigns[1].length ? (
                            <div className="grid grid-cols-4 gap-6">
                                {campaigns[1].map(c => <CampaignCard campaign={c} key={c.id} />)}
                            </div>
                        ) : (
                            <div className='flex-auto flex justify-center items-center'>
                                <div className='flex flex-col gap-6 items-center justify-center'>
                                    <EmptyImg className='w-40 h-auto' />
                                    <div className='text-2xl text-gray-500 font-medium'>No campaigns created yet</div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex-auto'>
                        <div className="flex flex-row justify-between mb-6">
                            <div className="text-4xl">Ended campaigns</div>
                        </div>
                        {campaigns[2].length ? (
                            <div className="grid grid-cols-4 gap-6">
                                {campaigns[2].map(c => <CampaignCard campaign={c} key={c.id} />)}
                            </div>
                        ) : (
                            <div className='flex-auto flex justify-center items-center'>
                                <div className='flex flex-col gap-6 items-center justify-center'>
                                    <EmptyImg className='w-40 h-auto' />
                                    <div className='text-2xl text-gray-500 font-medium'>No campaigns ended yet</div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
