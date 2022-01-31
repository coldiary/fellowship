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

export type SortedCampaigns = [active: Campaign[], ended: Campaign[]];

export const TipList = () => {
    const { address } = useGetAccountInfo();
    const isOwner = useIsContractOwner(contractAdresses.tips);
    const [campaigns, setCampaigns] = useState([[], []] as SortedCampaigns);
    const [
        creationModalShown, openCreationModal, closeCreationModal
    ] = useModal();

    useEffect(() => {
        (async () => {
            const all = await getAllCampaigns();
            const filtered = isOwner ? all : all.filter(c => c.creator_address === address);
            const sorted = filtered.reduce<SortedCampaigns>((acc, c) => {
                acc[c.status === CampaignStatus.Active ? 0 : 1].push(c);
                return acc;
            }, [[], []]);
            setCampaigns(sorted);
        })().catch(console.error);
    }, [isOwner]);

    return (
        <div className='max-w-screen-2xl mx-auto p-10 w-full flex-auto flex flex-col gap-6'>
            <div className='flex-auto'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-4xl">Active campaigns</div>
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

            <div className='flex-auto'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-4xl">Ended campaigns</div>
                </div>
                {campaigns[1].length ? (
                    <div className="grid grid-cols-4 gap-6">
                        {campaigns[1].map(c => <CampaignCard campaign={c} key={c.id} />)}
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
        </div>
    );
};
