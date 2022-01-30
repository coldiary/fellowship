import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';

import { primaryButton } from 'components/styles';

export const UnlockView: () => JSX.Element = () => {
  const { pathname } = useLocation();
  const {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton,
  } = DappUI;

  return (
    <div className='h-full flex justify-center items-center'>
      <div data-testid="unlockPage">
        <div className="my-4 text-center">
          <div className="py-4 px-2 mx-4">
            <h4 className="mb-4 text-lg font-medium">Connect your wallet</h4>
            <p className="mb-4">Choose a connection method below :</p>

            <div className="flex flex-row gap-4">
              <ExtensionLoginButton
                callbackRoute={pathname}
                className={`${primaryButton} px-3 py-2 login-button `}
                shouldRenderDefaultCss={false}
                loginButtonText={'Extension'}
              />
              <WebWalletLoginButton
                callbackRoute={pathname}
                className={`${primaryButton} px-3 py-2 login-button `}
                shouldRenderDefaultCss={false}
                loginButtonText={'Web wallet'}
              />
              <LedgerLoginButton
                loginButtonText={'Ledger'}
                callbackRoute={pathname}
                className={`${primaryButton} px-3 py-2 login-button `}
                shouldRenderDefaultCss={false}
              />
              <WalletConnectLoginButton
                callbackRoute={pathname}
                className={`${primaryButton} px-3 py-2 login-button `}
                shouldRenderDefaultCss={false}
                loginButtonText={'Maiar'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
