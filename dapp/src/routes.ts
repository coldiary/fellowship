import { dAppName } from 'config';
import { Tip } from 'pages/Tip';
import withPageTitle from './components/PageTitle';
import Home from './pages/Home';
import Transaction from './pages/Transaction';

export const routeNames = {
  home: '/home',
  dashboard: '/dashboard',
  kickstart: '/kickstart',
  fundraise: '/fundraise',
  tip: '/tip',
  trade: '/trade',
  giveaway: '/giveaway',
  airdrop: '/airdrop',
  transaction: '/transaction',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect'
};

const routes: Array<any> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.tip,
    title: 'Tip',
    component: Tip
  },
  // {
  //   path: routeNames.transaction,
  //   title: 'Transaction',
  //   component: Transaction
  // }
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • ${dAppName}`
    : `${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
