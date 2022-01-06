import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Context as DappContext } from '@elrondnetwork/dapp';

import './App.css';
import { Layout } from './components/Layout';
import { Fund } from './pages/Fund';
import { Kickstart } from './pages/Kickstart';
import { Tip } from './pages/Tip';
import { Trade } from './pages/Trade';
import { config, DappName } from "./network.config";
import { LedgerStyled } from "./components/elrond/LedgerStyled";
import { UnlockStyled } from "./components/elrond/UnlockStyled";
import { WalletConnectStyled } from "./components/elrond/WalletConnectStyled";

const Routing = () => {
    const location = useLocation<{ referer: string } | undefined>();

    const loginRedirect = location.state?.referer ?? '/';

    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/fund" />
            </Route>
            <Route path="/connect" exact={true} component={() => <UnlockStyled callbackRoute={loginRedirect} />}/>
            <Route path="/ledger" exact={true} component={() => <LedgerStyled callbackRoute={loginRedirect} />} />
            <Route path="/walletconnect" exact={true} component={() => <WalletConnectStyled callbackRoute={loginRedirect}/>} />
            <Route path="/fund">
                <Fund />
            </Route>
            <Route path="/kickstart">
                <Kickstart />
            </Route>
            <Route path="/tip">
                <Tip />
            </Route>
            <Route path="/trade">
                <Trade />
            </Route>
        </Switch>
    )
}

export const App = () => {
  return (
      <DappContext config={config} >
        <Router>
            <Layout title={DappName}>
                <Routing />
            </Layout>
        </Router>
      </DappContext>
  );
}
