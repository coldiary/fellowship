import React, { useCallback, useContext, useState } from 'react';
import debounce from 'lodash/debounce';
import { useForm } from 'react-hook-form';

import { getAddressForHerotag } from 'api/accounts';
import { createTrade } from 'api/trades';
import { ReactComponent as LoaderIcon } from 'assets/img/loader.svg';
import { CurrencySelect } from 'components/CurrencySelect';
import { primaryButton } from 'components/styles';
import { TokensContext } from 'contexts/Tokens';

export const CreateTradeModal = () => {
    const [offerCurrency, setOfferCurrency] = useState('EGLD');
    const [traderCurrency, setTraderCurrency] = useState('EGLD');
    const [searchingHerotag, setSearchingHerotag] = useState(false);
    const { get: getToken } = useContext(TokensContext);

    const submit = async (data: any) => {
        const offerToken = getToken(offerCurrency);
        const traderToken = getToken(traderCurrency);

        console.log({ offerToken, traderToken });

        if (!offerToken || !traderToken) return;

        await createTrade(
            +data.offer * Math.pow(10, offerToken.decimals),
            offerToken.identifier,
            +data.trader * Math.pow(10, traderToken.decimals),
            traderToken.identifier,
            (data.reserved_for ?? undefined)
        );
    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const searchHerotag = useCallback(debounce(async (input: string) => {
        setSearchingHerotag(true);
        const address = await getAddressForHerotag(input);
        if (address) setValue('resolved_for', address);
        setSearchingHerotag(false);
    }, 500), []);

    return (
        <div className='p-6'>
            <div className="text-2xl text-center mb-4">Create a trade</div>

            <form onSubmit={handleSubmit(submit)}>
                <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-row gap-8">
                        <div className="flex-auto flex flex-col gap-4">
                            <div className="text-2xl">I want to offer :</div>
                            <input type='number' {...register('offer', { required: true, min: 0.01 })} defaultValue={1}
                                className='text-xl text-right border p-2 w-full rounded-md border-gray-300 leading-5' />
                            <CurrencySelect onChange={setOfferCurrency} defaultCurrency={offerCurrency} />
                            <div className="text-sm">
                                {errors.offer?.type === 'min' && (<div className="text-red-400">You need to offer at least 0.01 {offerCurrency}</div>)}
                            </div>
                        </div>

                        <div className="flex-auto flex flex-col gap-4">
                            <div className="text-2xl">In exchange for :</div>
                            <input type='number' {...register('trader', { required: true, min: 0.01 })} defaultValue={1}
                                className='text-xl text-right border p-2 w-full rounded-md border-gray-300 leading-5' />
                            <CurrencySelect onChange={setTraderCurrency} defaultCurrency={traderCurrency} />
                            <div className="text-sm">
                                {errors.trader?.type === 'min' && (<div className="text-red-400">You need to ask at least 0.01 {traderCurrency}</div>)}
                            </div>
                        </div>
                    </div>
                    <div className="flex-auto flex flex-col gap-4">
                            <div className="text-2xl">Reserve trade for :</div>
                            <div className="flex flex-row gap-4">
                                <input type='text' {...register('reserved_for', { minLength: 62, maxLength: 62 })} placeholder="Enter erd address"
                                    className='w-3/4 border p-2 rounded-md border-gray-300 leading-5' />
                                <div className="relative">
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

                <div className="flex flex-col justify-end items-center gap-6">
                    <button type='submit' className={primaryButton}>Create trade</button>
                    <div className="text-xs text-gray-500 w-64">
                        Creating a trade requires a transaction on the Elrond Network (Tx fee: ~0.001egld)
                    </div>
                </div>
            </form>

            <div className="text-sm text-gray-500 mt-10">
                Assets are sent to destination as soon as the contract receive the requested counterpart assets.
            </div>
        </div>
    );
};
