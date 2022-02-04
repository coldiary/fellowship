import React from 'react';
import { DappProvider, DappUI, DappCoreUIWrapper } from '@elrondnetwork/dapp-core';
import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router-dom';

import Layout from 'components/Layout';
import { network, walletConnectBridge, walletConnectDeepLink } from 'config';
import { TokensContext, useTokensContext } from 'contexts/Tokens';
import Home from 'pages/Home';
import PageNotFound from 'pages/PageNotFound';
import { Tip } from 'pages/Tip';
import { Trade } from 'pages/Trade';

const {
    TransactionsToastList,
    NotificationModal,
    SignTransactionsModals,
} = DappUI;

const App = () => {
    const tokenContexValue = useTokensContext();

    return (
        <Router>
            <TokensContext.Provider value={tokenContexValue}>
                <DappProvider networkConfig={{ network, walletConnectBridge, walletConnectDeepLink }}>
                    <DappCoreUIWrapper>
                        <Routes>
                            <Route path="/" element={(
                                <Layout>
                                    <TransactionsToastList shouldRenderDefaultCss={false} />
                                    <NotificationModal />
                                    <SignTransactionsModals className='custom-modal ' />
                                    <Outlet/>
                                </Layout>
                            )}>
                                <Route index element={<Home />} />
                                <Route path="tip/*" element={<Tip />} />
                                <Route path="trade/*" element={<Trade />} />
                                <Route path="*" element={<PageNotFound />} />
                            </Route>
                        </Routes>
                    </DappCoreUIWrapper>
                </DappProvider>
            </TokensContext.Provider>
        </Router>
    );
};

export default App;
