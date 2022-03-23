import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Offer } from '../../assets/img/offer.svg';
import { ReactComponent as Share } from '../../assets/img/share.svg';
import { ReactComponent as Transfer } from '../../assets/img/transfer.svg';

interface Props {
    closeModal: () => void,
}

export const TradeHowTo: FC<Props> = () => {
    const { t } = useTranslation();
    return (
        <div className="p-2 md:p-6 flex flex-col gap-10">
            <div className="md:text-2xl uppercase font-bold opacity-70 text-center">{t('trade.how_to.title')}</div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <Offer className='w-36 md:w-full h-full'/>
                <div>
                    <div className="text-sm md:text-xl font-medium mb-6">{t('trade.how_to.step1.title')}</div>
                    <p className='text-xs md:text-base'>{t('trade.how_to.step1.description')}</p>
                </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-12">
                <div>
                    <div className="text-sm md:text-xl font-medium mb-6">{t('trade.how_to.step2.title')}</div>
                    <p className='text-xs md:text-base'>{t('trade.how_to.step2.description')}</p>
                </div>
                <Share className='w-36 md:w-full h-full'/>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <Transfer className='w-36 md:w-full h-full'/>
                <div>
                    <div className="text-sm md:text-xl font-medium mb-6">{t('trade.how_to.step3.title')}</div>
                    <p className='text-xs md:text-base'>{t('trade.how_to.step3.description')}</p>
                </div>
            </div>
        </div>
    );
};
