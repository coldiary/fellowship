import React, { useContext, useMemo } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { DappUI } from '@elrondnetwork/dapp-core';
import { useForm } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { Tips } from 'api/tips';
import { ReactComponent as Loader } from 'assets/img/loader.svg';
import { Modal, ConfirmModal, useModal } from 'components/Layout/Modal';
import { primaryButton, secondaryButton } from 'components/styles';
import { ToastsContext } from 'contexts/Toasts';
import { TokensContext } from 'contexts/Tokens';
import { CampaignStatus } from 'types/Tips';
import { EditCampaignModal } from './EditCampaignModal';
import { useCampaign } from './useCampaign';

export const CampaignPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { address } = useGetAccountInfo();
    const { get: getToken } = useContext(TokensContext);
    const { showToast } = useContext(ToastsContext);

    const [campaign, metadata, illustrationUri] = useCampaign({ id: id ? +id : undefined });
    const [editModalShown, openEditModal, closeEditModal] = useModal();
    const [endModalShown, openEndModal, closeEndModal] = useModal();

    const token = useMemo(() => {
        if (!campaign) return;
        return getToken(campaign.token_identifier);
    }, [campaign]);

    const claim = async () => {
        if (!campaign) return;
        await Tips.instance.claimCampaign(campaign.id);
    };

    const fund = async (data: any) => {
        if (!campaign) return;
        if (campaign.token_identifier === 'EGLD') {
            await Tips.instance.tipCampaign(campaign.id, `${+data.amount * Math.pow(10, 18)}`);
        } else {
            if (!token) {
                console.error('Unknown token identifier');
                return;
            }
            await Tips.instance.tipCampaign(campaign.id, `${+data.amount * Math.pow(10, token.decimals)}`);
        }
    };

    const onCloseEndModal = async (confirm: boolean) => {
        closeEndModal();

        if (!campaign) return;

        if (confirm) {
            await Tips.instance.endCampaign(campaign.id);
        }
    };

    const copyLink = async () => {
        navigator.clipboard.writeText(window.location.href);
        showToast({ message: t('link_copied') });
    };

    const { register, handleSubmit, formState: { errors } } = useForm();
    const isCreator = campaign?.creator_address === address;

    return (
        <div className='max-w-screen-2xl mx-auto md:my-4 p-4 md:p-10 md:pt-4 w-full flex-auto flex flex-col'>
            { !metadata || !campaign ? (
                <div className="flex items-center justify-between p-6">
                    <Loader className='m-auto w-10'/>
                </div>
            ) : (
                <div className='flex flex-col gap-6'>
                    <div className='flex justify-center items-center'>
                        <div className='py-2 px-6 border bg-whitee rounded-full cursor-pointer hover:shadow-md text-center' onClick={copyLink}>
                            {t('tip.page.share')} : <span className="text-main">{window.location.href}</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-auto flex flex-col border bg-white rounded-md overflow-hidden">
                            <img className='w-auto h-36 md:h-96 object-cover' src={illustrationUri} />
                            <div className="p-6 flex flex-col gap-4">
                                <div className="text-2xl md:text-4xl font-bold">{metadata.title}</div>
                                <div className="md:text-xl">{metadata.description}</div>
                            </div>
                        </div>
                        <div className="md:w-80 flex-shrink-0 flex flex-col gap-3 md:gap-6 border bg-white rounded-md p-6">
                            <div className="flex flex-col gap-2">
                                <div className="text-lg md:text-xl font-medium">{t('tip.page.total_amount')} :</div>
                                <div className="text-2xl md:text-4xl text-right">
                                    <DappUI.Denominate value={campaign.amount} token={token?.name ?? '-'} decimals={2} denomination={token?.decimals ?? 18} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="text-lg md:text-xl font-medium">{t('tip.page.total_donations')} :</div>
                                <div className="text-2xl md:text-4xl text-right">{campaign.donations ?? 0}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="text-lg md:text-xl font-medium">{t('tip.page.total_participants')} :</div>
                                <div className="text-2xl md:text-4xl text-right">{campaign.participants ?? 0}</div>
                            </div>

                            <div className="hidden md:block flex-auto"></div>

                            { campaign.status === CampaignStatus.Active ? (
                                isCreator ? (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <div className="text-lg md:text-xl font-medium">{t('tip.page.claimable')} :</div>
                                            <div className="text-2xl md:text-4xl text-right">
                                                <DappUI.Denominate value={campaign.claimable} token={token?.name ?? '-'} decimals={2} denomination={token?.decimals ?? 18} />
                                            </div>
                                        </div>
                                        <button className={primaryButton} onClick={claim}  disabled={campaign.claimable === '0'}>{t('tip.page.claim')}</button>
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmit(fund)}>
                                        <div className="flex flex-col gap-2">
                                            <div className="text-xl font-medium">{t('tip.page.amount.label')} :</div>
                                            <div className="flex flex-row gap-2 items-center">
                                                <input {...register('amount', { min: 0.01, required: true, value: 1 })} type="number" step={0.01}
                                                    className={`border p-2 w-full rounded-md border-gray-300 leading-5 text-2xl md:text-4xl text-right ${errors.amount ? 'text-red-700' : ''}`}
                                                />
                                                <div className="text-2xl md:text-4xl">
                                                    { token?.name }
                                                </div>
                                            </div>
                                            {errors.amount?.type === 'required' && (<div className="text-red-400">{t('tip.page.amount.errors.required')}</div>)}
                                            {errors.amount?.type === 'min' && (<div className="text-red-400">{t('tip.page.amount.errors.min')}</div>)}
                                            <button type='submit' data-tip={address ? null : t('login')} data-for="tip_action"
                                                className={`${primaryButton} disabled:opacity-50`} disabled={!address}>{t('tip.page.tip')}</button>
                                            <ReactTooltip id='tip_action' place='bottom' />
                                        </div>
                                    </form>
                                )
                            ) : (
                                <div className="text-xl font-medium text-white bg-main-lighter px-3 py-2 rounded-md">
                                    {t('tip.page.ended')}
                                </div>
                            )}

                            { isCreator && campaign.status === CampaignStatus.Active && (
                                <div className="flex flex-col gap-2">
                                    <Modal shown={editModalShown} closeModal={closeEditModal}
                                        content={() => <EditCampaignModal id={campaign.id} metadata={metadata} closeModal={closeEditModal} />}
                                        toggle={() => (<button className={secondaryButton} onClick={openEditModal}>{t('tip.page.edit_campaign')}</button>)}
                                    />
                                    <ConfirmModal
                                        shown={endModalShown}
                                        closeModal={onCloseEndModal}
                                        content={() => (
                                            <div className='flex flex-col gap-4'>
                                                <div className="text-lg text-center uppercase">{t('tip.page.end_confirm.title')}</div>
                                                <div className="flex flex-col gap-4">
                                                    <Trans i18nKey='tip.page.end_confirm.content'>
                                                        Are you sure you want to end this campaign ?<br />
                                                        <div className="text-sm text-gray-500">
                                                            {'You won\'t be able to able to reopen it afterwards.'}<br/>
                                                            All unclaimed funds will be sent to your address.
                                                        </div>
                                                    </Trans>
                                                </div>
                                            </div>
                                        )}
                                        toggle={() => <button onClick={openEndModal} className={secondaryButton}>{t('tip.page.end_campaign')}</button>}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
