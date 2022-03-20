import React, { FC, useCallback, useContext, useState } from 'react';
import debounce from 'lodash/debounce';
import { useForm } from 'react-hook-form';

import { getAddressForHerotag } from 'api/accounts';
import { Trades } from 'api/trades';
import { ReactComponent as LoaderIcon } from 'assets/img/loader.svg';
import { CurrencySelect } from 'components/CurrencySelect';
import { primaryButton } from 'components/styles';
import { TokensContext } from 'contexts/Tokens';

interface Props {
    closeModal: () => void;
}

export const CreateTradeModal: FC<Props> = ({ closeModal }) => {
    const [offerCurrency, setOfferCurrency] = useState('EGLD');
    const [traderCurrency, setTraderCurrency] = useState('EGLD');
    const [searchingHerotag, setSearchingHerotag] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { get: getToken } = useContext(TokensContext);

    const submit = async (data: any) => {
        setSubmitting(true);
        const offerToken = getToken(offerCurrency);
        const traderToken = getToken(traderCurrency);

        if (!offerToken || !traderToken) return;

        await Trades.instance.createTrade(
            +data.offer * Math.pow(10, offerToken.decimals),
            offerToken.identifier,
            +data.trader * Math.pow(10, traderToken.decimals),
            traderToken.identifier,
            (data.reserved_for ?? undefined)
        );
        closeModal();

    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const searchHerotag = useCallback(debounce(async (input: string) => {
        setSearchingHerotag(true);
        const address = await getAddressForHerotag(input);
        if (address) setValue('resolved_for', address);
        setSearchingHerotag(false);
    }, 500), []);

    return (
        <div className='md:p-6'>
            <div className="text-2xl md:text-center mb-4">Create a trade</div>

            <form onSubmit={handleSubmit(submit)}>
                <div className="flex flex-col gap-3 mb-3 md:gap-6 md:mb-6">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                        <div className="flex-auto flex flex-col gap-4">
                            <div className="text-xl">I want to offer :</div>
                            <div className="flex flex-row gap-6">
                                <input type='number' {...register('offer', { required: true, min: 0.01 })} defaultValue={1}
                                    className='text-xl text-right border p-2 w-full rounded-md border-gray-300 leading-5' />
                                <div className="flex-shrink-0">
                                    <CurrencySelect onChange={setOfferCurrency} defaultCurrency={offerCurrency} />
                                </div>
                            </div>
                            <div className="text-sm">
                                {errors.offer?.type === 'min' && (<div className="text-red-400">You need to offer at least 0.01 {offerCurrency}</div>)}
                            </div>
                        </div>

                        <div className="flex-auto flex flex-col gap-4">
                            <div className="text-xl">In exchange for :</div>
                            <div className="flex flex-row gap-6">
                                <input type='number' {...register('trader', { required: true, min: 0.01 })} defaultValue={1}
                                    className='text-xl text-right border p-2 w-full rounded-md border-gray-300 leading-5' />
                                <div className="flex-shrink-0">
                                    <CurrencySelect onChange={setTraderCurrency} defaultCurrency={traderCurrency} />
                                </div>
                            </div>
                            <div className="text-sm">
                                {errors.trader?.type === 'min' && (<div className="text-red-400">You need to ask at least 0.01 {traderCurrency}</div>)}
                            </div>
                        </div>
                    </div>
                    <div className="flex-auto flex flex-col gap-4">
                            <div className="text-xl">Reserve trade for :</div>
                            <div className="flex flex-row gap-4">
                                <input type='text' {...register('reserved_for', { minLength: 62, maxLength: 62 })} placeholder="Enter erd address"
                                    className='w-full md:w-3/4 border p-2 rounded-md border-gray-300 leading-5' />
                                <div className="hidden md:block relative">
                                    <input type='text' placeholder="Search @herotag" onInput={e => searchHerotag(e.currentTarget.value)}
                                        className='border p-2 rounded-md border-gray-300 leading-5' />
                                    { searchingHerotag && <LoaderIcon className='w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2' /> }
                                </div>
                            </div>
                            <div className="text-sm">
                                {!!errors.reserved_for && (<div className="text-red-400">Invalid address format</div>)}
                            </div>
                        </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse justify-end items-center gap-3 md:gap-6">
                    <button type='submit' className={primaryButton}>
                        { submitting ?
                            <LoaderIcon className='w-4 h-6' /> :
                            <>Create trade</>
                        }
                    </button>
                    <div className="text-xs text-gray-500 w-64">
                        Creating a trade requires a transaction on the Elrond Network (Tx fee: ~0.001egld)
                    </div>
                </div>
            </form>

            <div className="text-sm text-gray-500 mt-5 md:mt-10">
                Assets are sent to destination as soon as the contract receive the requested counterpart assets.
            </div>
        </div>
    );
};
