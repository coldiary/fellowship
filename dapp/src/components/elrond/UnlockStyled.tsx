import { FC } from 'react'
import { Pages } from '@elrondnetwork/dapp'
import './unlock.scss';
import { Close } from '../Icons';
import { Link } from 'react-router-dom';

export const UnlockStyled: FC<{ callbackRoute: string }> = ({ callbackRoute }) => (
    <div className="w-[500px] max-w-full m-auto mt-50">
        <div className="unlock">
            <div className="bg-dark rounded-md text-black p-6">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold">Connect a wallet</h2>
                    <Link to={'/'} className="p-2 hover:bg-primary hover:text-black rounded-md">
                        <Close />
                    </Link>
                </div>
                <div className="text-center">
                    <Pages.Unlock
                        callbackRoute={callbackRoute}
                        title=""
                        lead="Connect securely using one of the following method:"
                        ledgerRoute="/ledger"
                        walletConnectRoute="/walletconnect"
                    />
                </div>
            </div>
        </div>
    </div>
)
