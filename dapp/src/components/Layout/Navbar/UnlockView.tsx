import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core-components';
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
                buttonClassName={`${primaryButton} px-3 py-2 `}
                className={'custom-modal '}
                shouldRenderDefaultCss={true}
                loginButtonText={'Extension'}
              />
              <WebWalletLoginButton
                callbackRoute={pathname}
                buttonClassName={`${primaryButton} px-3 py-2 `}
                className='custom-modal'
                shouldRenderDefaultCss={true}
                loginButtonText={'Web wallet'}
              />
              <LedgerLoginButton
                loginButtonText={'Ledger'}
                callbackRoute={pathname}
                buttonClassName={`${primaryButton} px-3 py-2 `}
                className='custom-modal'
                shouldRenderDefaultCss={true}
              />
              <WalletConnectLoginButton
                callbackRoute={pathname}
                buttonClassName={`${primaryButton} px-3 py-2 `}
                className='custom-modal'
                shouldRenderDefaultCss={true}
                loginButtonText={'Maiar'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
