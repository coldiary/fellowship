import React from 'react';
import { DappUI, getIsLoggedIn } from '@elrondnetwork/dapp-core';

import { primaryButton } from 'components/styles';
import { routeNames } from 'routes';

export const UnlockView: () => JSX.Element = () => {
  const {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton,
  } = DappUI;

  React.useEffect(() => {
    const isLoggedIn = getIsLoggedIn();
    if (isLoggedIn) {
      window.location.href = routeNames.dashboard;
    }
  }, []);

  return (
    <div className='h-full flex justify-center items-center'>
      <div data-testid="unlockPage">
        <div className="my-4 text-center">
          <div className="py-4 px-2 mx-4">
            <h4 className="mb-4 text-lg font-medium">Connect your wallet</h4>
            <p className="mb-4">Choose a connection method below :</p>

            <div className="flex flex-row gap-4">
              <ExtensionLoginButton
                callbackRoute={routeNames.dashboard}
                className={`${primaryButton} px-3 py-2 login-button `}
                shouldRenderDefaultCss={false}
                loginButtonText={'Extension'}
              />
              <WebWalletLoginButton
                callbackRoute={routeNames.dashboard}
                className={`${primaryButton} px-3 py-2 login-button `}
                shouldRenderDefaultCss={false}
                loginButtonText={'Web wallet'}
              />
              <LedgerLoginButton
                loginButtonText={'Ledger'}
                callbackRoute={routeNames.dashboard}
                className={`${primaryButton} px-3 py-2 login-button `}
                shouldRenderDefaultCss={false}
              />
              <WalletConnectLoginButton
                callbackRoute={routeNames.dashboard}
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

export default UnlockView;
