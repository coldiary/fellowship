import React, { useEffect } from 'react';
import { transactionServices, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import useSWR from 'swr';

import { Tips } from 'api/tips';
import { ReactComponent as EmptyImg } from 'assets/img/empty.svg';
import { Button } from 'components/Button';
import { Modal, useModal } from 'components/Layout/Modal';
import { contracts } from 'config';
import { Campaign, CampaignStatus } from 'types/Tips';
import githubLogo from '../../assets/img/github.png';
import { CampaignCard } from './CampaignCard';
import { CampaignHowTo } from './CampaignHowTo';
import { CreateCampaignModal } from './CreateCampaignModal';

export type SortedCampaigns = [active: Campaign[], ended: Campaign[]];

const { useGetPendingTransactions } = transactionServices;

export const CampaignList = () => {
    const { hasPendingTransactions } = useGetPendingTransactions();
    const { address } = useGetAccountInfo();
    const { data: campaigns = [[], []], mutate } = useSWR(address ? `campaigns-${address}` : null, async (): Promise<SortedCampaigns> => {
        if (!address) return [[], []];
        const own = await Tips.instance.getCampaignsFor(address);
        return own.reduce<SortedCampaigns>((acc, c) => {
            acc[c.status === CampaignStatus.Active ? 0 : 1].push(c);
            return acc;
        }, [[], []]);;
    });
    const [ creationModalShown, openCreationModal, closeCreationModal ] = useModal();
    const [ howToModalShown, openHowToModal, closeHowToModal ] = useModal();

    useEffect(() => { mutate(); }, [hasPendingTransactions]);

    return (
        <div className='max-w-screen-2xl mx-auto p-10 w-full flex-auto flex flex-col gap-6'>
            <div className='flex flex-row items-center justify-end gap-4'>
                <Modal shown={howToModalShown} closeModal={closeHowToModal}
                    content={() => <CampaignHowTo closeModal={closeHowToModal} />}
                    toggle={() => (
                        <Button onClick={openHowToModal} type="clear">
                            How it works ?
                        </Button>
                    )}>
                </Modal>

                <a className="flex-shrink-0" href={contracts.tips.sourceUrl} target='_blank' rel="noreferrer">
                    <img className='w-5 h-5' src={githubLogo}></img>
                </a>

                <Modal shown={creationModalShown} closeModal={closeCreationModal}
                    content={() => <CreateCampaignModal closeModal={closeCreationModal} />}
                    toggle={() => (
                        <Button onClick={openCreationModal} type="secondary" onlyAuth={true}>
                            Create <span className='hidden xs:inline'>campaign</span>
                        </Button>
                    )}>
                </Modal>
            </div>
            <div className='flex-auto flex flex-col'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-2xl lg:text-3xl">Active campaigns</div>
                </div>
                {campaigns[0].length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {campaigns[0].map(c => <CampaignCard campaign={c} key={c.id} />)}
                    </div>
                ) : (
                    <div className='flex-auto flex justify-center items-center'>
                        <div className='flex flex-col gap-6 items-center justify-center'>
                            <EmptyImg className='w-28 md:w-40 h-auto' />
                            <div className='text-2xl text-gray-500 font-medium'>No campaigns created yet</div>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex-auto flex flex-col'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-2xl lg:text-3xl">Ended campaigns</div>
                </div>
                {campaigns[1].length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {campaigns[1].map(c => <CampaignCard campaign={c} key={c.id} />)}
                    </div>
                ) : (
                    <div className='flex-auto flex justify-center items-center'>
                        <div className='flex flex-col gap-6 items-center justify-center'>
                            <EmptyImg className='w-28 md:w-40 h-auto' />
                            <div className='text-2xl text-gray-500 font-medium'>No campaigns ended yet</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
