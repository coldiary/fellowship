import React, { FC, useContext, useMemo } from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { Link } from 'react-router-dom';

import { ReactComponent as Loader } from 'assets/img/loader.svg';
import { ReactComponent as TradeIcon } from 'assets/img/trade.svg';
import { TokensContext } from 'contexts/Tokens';
import { Trade } from 'types/Trades';

const {
    Denominate
} = DappUI;

interface Props {
    trade: Trade;
}

export const TradeCard: FC<Props> = ({ trade }) => {
    const { get } = useContext(TokensContext);

    const [offerToken, traderToken] = useMemo(() => [
        get(trade.offer_asset_token),
        get(trade.trader_asset_token)
    ], [trade]);

    return (
        <div className='border bg-white rounded-md overflow-hidden transition ease-in-out transform hover:scale-105 cursor-pointer'>
            <Link to={`${trade.id}`} className='h-full flex flex-col hover:text-main'>
                { !offerToken || !traderToken ? (
                    <div className="flex items-center justify-between">
                        <Loader className='m-auto w-10'/>
                    </div>
                ) : (
                    <div className="grid grid-cols-trade p-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-xs uppercase">Offered</div>
                            <div className="text-lg">
                                <Denominate value={trade.offer_asset_quantity} token={offerToken.name} denomination={offerToken.decimals} decimals={2}/>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <TradeIcon />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-xs uppercase">Asked</div>
                            <div className="text-lg">
                                <Denominate value={trade.trader_asset_quantity} token={traderToken.name} denomination={traderToken.decimals} decimals={2}/>
                            </div>
                        </div>
                    </div>
                )}
            </Link>
        </div>
    );
};
