import { FC } from 'react'
import { Pages } from '@elrondnetwork/dapp'
import './ledger.scss';
import { Close } from '../Icons';
import { Link } from 'react-router-dom';

export const WalletConnectStyled: FC<{ callbackRoute: string }> = ({ callbackRoute }) => (
    <div className="w-[500px] max-w-full m-auto mt-50">
        <div className="ledger">
            <div className="bg-dark rounded-md text-black p-6">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold">Maiar login</h2>
                    <Link to={'/connect'} className="p-2 hover:bg-primary hover:text-black rounded-md">
                        <Close />
                    </Link>
                </div>
                <div className="text-center">
                    <Pages.WalletConnect callbackRoute={callbackRoute}
                        logoutRoute="/"
                        title=""
                        lead="Scan the QR code using Maiar"/>
                </div>
            </div>
        </div>
    </div>
)
