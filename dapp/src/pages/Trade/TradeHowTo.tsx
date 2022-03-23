import React, { FC } from 'react';

import { ReactComponent as Offer } from '../../assets/img/offer.svg';
import { ReactComponent as Share } from '../../assets/img/share.svg';
import { ReactComponent as Transfer } from '../../assets/img/transfer.svg';

interface Props {
    closeModal: () => void,
}

export const TradeHowTo: FC<Props> = () => {
    return (
        <div className="p-2 md:p-6 flex flex-col gap-10">
            <div className="text-2xl uppercase font-bold opacity-70 text-center">Trade your assets with confidence</div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <Offer className='w-48 md:w-full h-full'/>
                <div>
                    <div className="text-xl font-medium mb-6">Step 1 - Create an offer</div>
                    <p>
                        Create a trade offer by selecting the token and amount you want to offer and the token and amount you want in exchange.
                        You can reserve the trade for a specifi account if you already know its address.
                    </p>
                </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-12">
                <div>
                    <div className="text-xl font-medium mb-6">Step 2 - Send your trade offer</div>
                    <p>{'Your newly created offer has a unique link that you can now send directly to the account for which the trade is reserved \(or anyone who\'d fill the trade\).'}</p>
                </div>
                <Share className='w-48 md:w-full h-full'/>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <Transfer className='w-48 md:w-full h-full'/>
                <div>
                    <div className="text-xl font-medium mb-6">Step 3 - Wait for the trade to proceed </div>
                    <p>{'It\'s up to whoever you sent the trade to proceed now. As soon as they send the requested amount of token asked, the trade will proceed and you\'ll both receive your funds.'}</p>
                </div>
            </div>
        </div>
    );
};
