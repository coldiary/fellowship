import React from 'react';
import { DappUI, DappProvider } from '@elrondnetwork/dapp-core';
import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router-dom';

import { ComposeProviders } from 'components/ComposeProviders';
import Layout from 'components/Layout';
import { ToastList } from 'components/Toast';
import { AccountContextProvider } from 'contexts/Account';
import { ToastsContextProvider } from 'contexts/Toasts';
import { TokensContextProvider } from 'contexts/Tokens';
import Home from 'pages/Home';
import PageNotFound from 'pages/PageNotFound';
import { Tip } from 'pages/Tip';
import { Trade } from 'pages/Trade';

const {
    TransactionsToastList,
    SignTransactionsModals,
    NotificationModal,
} = DappUI;

const App = () => {
    return (
        <Router>
            <DappProvider environment='devnet'>
                <ComposeProviders providers={[
                    ToastsContextProvider,
                    TokensContextProvider,
                    AccountContextProvider,
                ]}>
                    <Routes>
                        <Route path="/" element={(
                            <Layout>
                                <ToastList />
                                <TransactionsToastList />
                                <SignTransactionsModals className='custom-modal ' />
                                <NotificationModal  />
                                <Outlet/>
                            </Layout>
                        )}>
                            <Route index element={<Home />} />
                            <Route path="tip/*" element={<Tip />} />
                            <Route path="trade/*" element={<Trade />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                    </Routes>
                </ComposeProviders>
            </DappProvider>
        </Router>
    );
};

export default App;
