import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { DappUI } from '@elrondnetwork/dapp-core-components';
import { useNavigate, useParams } from 'react-router-dom';

import { getTrade, cancelTrade, trade as doTrade } from 'api/trades';
import { ReactComponent as Loader } from 'assets/img/loader.svg';
import { ReactComponent as TradeIcon } from 'assets/img/trade.svg';
import { ConfirmModal, useModal } from 'components/Layout/Modal';
import { primaryButton } from 'components/styles';
import { TokensContext } from 'contexts/Tokens';
import { Trade } from 'types/Trades';
import { getShortHash } from 'utils/display';

export const TradePage = () => {
    const { id } = useParams();
    const { address } = useGetAccountInfo();
    const navigate = useNavigate();
    const { get: getToken } = useContext(TokensContext);
    const [trade, setTrade] = useState<Trade | undefined>(undefined);
    const isCreator = trade?.offer_address === address;

    const [cancelModalShown, openCancelModal, closeCancelModal] = useModal();

    useEffect(() => {
        if (!trade) return;
        if (trade.offer_address !== address && trade.trader_address !== address) {
            navigate('/');
        }
    }, [trade]);

    useEffect(() => {
        (async () => {
            if (!id) return;
            setTrade(await getTrade(+id));
        })().catch(console.error);
    }, [id]);

    const [offerToken, traderToken] = useMemo(() => {
        if (!trade) return [];
        return [getToken(trade.offer_asset_token), getToken(trade.trader_asset_token)];
    }, [trade]);

    const proceedTrade = async (data: any) => {
        if (!trade || !traderToken) return;
        await doTrade(trade.id, +data.amount * Math.pow(10, traderToken.decimals), traderToken.identifier);
    };

    const onCloseCancelModal = async (confirm: boolean) => {
        closeCancelModal();

        if (!id) return;

        if (confirm) {
            await cancelTrade(+id);
        }
    };

    return (
        <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto flex flex-col'>
            { !trade || !offerToken || !traderToken ? (
                <div className="flex items-center justify-between p-6">
                    <Loader className='m-auto w-10'/>
                </div>
            ) : (
                <div className="flex flex-col gap-24 p-12 bg-whitee border">
                    <div className="text-lg text-center">
                        {isCreator ? 'You created this trade :' : 'This trade has been reserved for you :'}
                    </div>

                    <div className="grid grid-cols-trade items-center">
                        <div className="flex-auto flex flex-col items-center gap-8">
                            <div className="text-xs uppercase">Offered</div>
                            <div className="flex flex-row items-center gap-4">
                                <img className='w-8 h-8' src={offerToken.assets?.svgUrl} />
                                <div className="text-4xl">
                                    <DappUI.Denominate value={trade.offer_asset_quantity} token={offerToken.name} denomination={offerToken.decimals} decimals={2}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <TradeIcon className='w-full h-full' />
                        </div>
                        <div className="flex-auto flex flex-col items-center gap-8">
                            <div className="text-xs uppercase">Asked</div>
                            <div className="flex flex-row items-center gap-4">
                                <img className='w-8 h-8' src={traderToken.assets?.svgUrl} />
                                <div className="text-4xl">
                                    <DappUI.Denominate value={trade.trader_asset_quantity} token={traderToken.name} denomination={traderToken.decimals} decimals={2}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-trade items-center">
                        <div className="flex-auto flex flex-col items-center gap-4">
                            {isCreator ? (
                                <ConfirmModal shown={cancelModalShown} closeModal={onCloseCancelModal}
                                    toggle={() => <button className={primaryButton} onClick={openCancelModal}>Cancel trade</button>}
                                    content={() => (
                                        <div className='flex flex-col gap-4'>
                                            <div className="text-lg text-center uppercase">Cancel trade</div>
                                            <div className="flex flex-col gap-4">
                                                Are you sure you want to cancel this trade ?<br />
                                                <div className="text-sm text-gray-500">
                                                    Your funds will be returned to your address.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                ></ConfirmModal>
                            ): (
                                <div className='text-gray-600 font-medium'>
                                    <>Created by {getShortHash(trade.offer_address)}</>
                                </div>
                            )}
                        </div>
                        <div className="flex-shrink-0 w-6 flex justify-center items-center">
                        </div>
                        <div className="flex-auto flex flex-col items-center gap-4">
                            {!isCreator ? (
                                <button className={primaryButton} onClick={proceedTrade}>Trade</button>
                            ) : (
                                <div className='text-gray-600 font-medium'>
                                    {trade.trader_address && <>Reserved for {getShortHash(trade.trader_address)}</>}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
