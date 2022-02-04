import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { getTrade, cancelTrade, trade as doTrade } from 'api/trades';
import { ReactComponent as Loader } from 'assets/img/loader.svg';
import { useModal } from 'components/Layout/Modal';
import { TokensContext } from 'contexts/Tokens';
import { Trade } from 'types/Trades';

export const TradePage = () => {
    const { id } = useParams();
    const { address } = useGetAccountInfo();
    const navigate = useNavigate();
    const { get: getToken } = useContext(TokensContext);
    const [trade, setTrade] = useState<Trade | undefined>(undefined);

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

    const cancel = async () => {
        if (!id) return;
        await cancelTrade(+id);
    };

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

    const { register, handleSubmit, formState: { errors } } = useForm();
    const isCreator = trade?.offer_address === address;

    return (
        <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto flex flex-col'>
            { !offerToken || !traderToken || !trade ? (
                <div className="flex items-center justify-between p-6">
                    <Loader className='m-auto w-10'/>
                </div>
            ) : (
                <div className="flex flex-row gap-6">
                    test
                </div>
            )}
        </div>
    );
};
