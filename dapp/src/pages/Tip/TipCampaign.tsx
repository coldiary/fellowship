import React, { useContext, useMemo } from 'react';
import { useGetAccountInfo, DappUI } from '@elrondnetwork/dapp-core';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { endCampaign, claimCampaign } from 'api/tips';
import { tipCampaign } from 'api/tips';
import { ReactComponent as Loader } from 'assets/img/loader.svg';
import { Modal, ConfirmModal, useModal } from 'components/Layout/Modal';
import { primaryButton, secondaryButton } from 'components/styles';
import { TokensContext } from 'contexts/Tokens';
import { CampaignStatus } from 'types/Tips';
import { EditCampaignModal } from './EditCampaignModal';
import { useCampaign } from './useCampaign';

export const TipCampaign = () => {
    const { id } = useParams();
    const { address } = useGetAccountInfo();
    const { get: getToken } = useContext(TokensContext);

    const [campaign, metadata, illustrationUri] = useCampaign({ id: id ? +id : undefined });
    const [editModalShown, openEditModal, closeEditModal] = useModal();
    const [endModalShown, openEndModal, closeEndModal] = useModal();

    const token = useMemo(() => {
        if (!campaign) return;
        return getToken(campaign.token_identifier);
    }, [campaign]);

    const claim = async () => {
        if (!campaign) return;
        await claimCampaign(campaign.id);
    };

    const fund = async (data: any) => {
        if (!campaign) return;
        if (campaign.token_identifier === 'EGLD') {
            await tipCampaign(campaign.id, +data.amount * Math.pow(10, 18));
        } else {
            if (!token) {
                console.error('Unknown token identifier');
                return;
            }
            await tipCampaign(campaign.id, +data.amount * Math.pow(10, token.decimals));
        }
    };

    const onCloseEndModal = async (confirm: boolean) => {
        closeEndModal();

        if (!campaign) return;

        if (confirm) {
            await endCampaign(campaign.id);
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm();
    const isCreator = campaign?.creator_address === address;

    return (
        <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto flex flex-col'>
            { !metadata || !campaign ? (
                <div className="flex items-center justify-between p-6">
                    <Loader className='m-auto w-10'/>
                </div>
            ) : (
                <div className="flex flex-row gap-6">
                    <div className="flex-auto flex flex-col border bg-white rounded-md overflow-hidden">
                        <img className='w-auto h-96 object-cover' src={illustrationUri} />
                        <div className="p-6 flex flex-col gap-4">
                            <div className="text-4xl font-bold">{metadata.title}</div>
                            <div className="text-xl">{metadata.description}</div>
                        </div>
                    </div>
                    <div className="w-80 flex-shrink-0 flex flex-col gap-6 border bg-white rounded-md p-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-medium">Total amount collected :</div>
                            <div className="text-4xl text-right">
                                <DappUI.Denominate value={campaign.amount} token={token?.name ?? '-'} decimals={2} denomination={token?.decimals ?? 18} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-medium">Total donations :</div>
                            <div className="text-4xl text-right">
                                0
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-medium">Total participants :</div>
                            <div className="text-4xl text-right">
                                0
                            </div>
                        </div>

                        <div className="flex-auto"></div>

                        { campaign.status === CampaignStatus.Active ? (
                            isCreator ? (
                                <div className="flex flex-col gap-2">
                                    <div className="text-xl font-medium">Claimable :</div>
                                    <div className="text-4xl text-right">
                                        <DappUI.Denominate value={campaign.claimable} token={token?.name ?? '-'} decimals={2} denomination={token?.decimals ?? 18} />
                                    </div>
                                    <button className={primaryButton} onClick={claim}  disabled={campaign.claimable === '0'}>Claim</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(fund)}>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-xl font-medium">I want to give :</div>
                                        <div className="flex flex-row gap-2 items-center">
                                            <input {...register('amount', { min: 0, required: true, value: 1 })} type="number"
                                                className={`border p-2 w-full rounded-md border-gray-300 leading-5 text-4xl text-right ${errors.amount ? 'text-red-700' : ''}`}
                                             />
                                            <div className="text-4xl">
                                                { campaign.token_identifier }
                                            </div>
                                        </div>
                                        {errors.amount?.type === 'required' && (<div className="text-red-400">Amount is required</div>)}
                                        {errors.amount?.type === 'min' && (<div className="text-red-400">Amount should be a positive value</div>)}
                                        <button type='submit' data-tip={address ? null : 'Connect your wallet to use this action'} data-for="tip_action"
                                            className={`${primaryButton} disabled:opacity-50`} disabled={!address}>Tip</button>
                                        <ReactTooltip id='tip_action' place='bottom' />
                                    </div>
                                </form>
                            )
                        ) : (
                            <div className="text-xl font-medium text-white bg-main-lighter px-3 py-2 rounded-md">
                                This campaign has ended
                            </div>
                        )}

                        { isCreator && campaign.status === CampaignStatus.Active && (
                            <div className="flex flex-col gap-2">
                                <Modal shown={editModalShown} closeModal={closeEditModal}
                                    content={() => <EditCampaignModal id={campaign.id} metadata={metadata} closeModal={closeEditModal} />}
                                    toggle={() => (<button className={secondaryButton} onClick={openEditModal}>Edit campaign</button>)}
                                />
                                <ConfirmModal
                                    shown={endModalShown}
                                    closeModal={onCloseEndModal}
                                    content={() => (
                                        <div className='flex flex-col gap-4'>
                                            <div className="text-lg text-center uppercase">End campaign</div>
                                            <div className="flex flex-col gap-4">
                                                Are you sure you want to end this campaign ?<br />
                                                <div className="text-sm text-gray-500">
                                                    {'You won\'t be able to able to reopen it afterwards.'}<br/>
                                                    All unclaimed funds will be sent to your address.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    toggle={() => <button onClick={openEndModal} className={secondaryButton}>End campaign</button>}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
