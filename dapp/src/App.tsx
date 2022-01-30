import React from 'react';
import { DappProvider, DappUI } from '@elrondnetwork/dapp-core';
import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router-dom';

import Layout from 'components/Layout';
import { network, walletConnectBridge, walletConnectDeepLink } from 'config';
import Home from 'pages/Home';
import PageNotFound from 'pages/PageNotFound';
import { Tip } from 'pages/Tip';

const {
    TransactionsToastList,
} = DappUI;

const App = () => {
    return (
        <Router>
            <DappProvider networkConfig={{ network, walletConnectBridge, walletConnectDeepLink }}>
                <Routes>
                    <Route path="/" element={(
                        <Layout>
                            <TransactionsToastList shouldRenderDefaultCss={false} />
                            <Outlet/>
                        </Layout>
                    )}>
                        <Route index element={<Home />} />
                        <Route path="tip/*" element={<Tip />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </DappProvider>
        </Router>
    );
};

export default App;
