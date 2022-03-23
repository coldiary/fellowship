import React, { FC }  from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import AirdropImg from 'assets/img/home/airdrop.svg';
import FundImg from 'assets/img/home/fund.svg';
import GiveawayImg from 'assets/img/home/giveaway.svg';
import KickstartImg from 'assets/img/home/kickstart.svg';
import TipImg from 'assets/img/home/tip.svg';
import TradeImg from 'assets/img/home/trade.svg';

interface ItemProps {
  illustration: string;
  title: string;
  link: string;
  tooltip?: string;
}

const Item: FC<ItemProps> = (props) => (
  <Link to={props.link} className='bg-white border rounded-xl p-6 hover:shadow-md'>
    <div className="h-full flex flex-col items-center hover:text-main"  {...(props.tooltip ? {
      'data-tip': props.tooltip,
      'data-for': 'home',
    }: {})}>
      <div className='h-40 flex items-center justify-center'>
        <img className='h-full' src={props.illustration} alt="" />
      </div>
      <div className="m-6 flex-auto flex justify-center items-center">
        <div className='text-2xl font-medium text-center'>
          {props.title}
        </div>
      </div>
    </div>
  </Link>
);

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <Item tooltip={t('coming_soon')} link={'/' /*routeNames.kickstart */} illustration={KickstartImg} title={t('home.kickstart')}></Item>
        <Item tooltip={t('coming_soon')} link={'/' /*routeNames.fundraise */} illustration={FundImg} title={t('home.fundraise')}></Item>
        <Item link="/tip" illustration={TipImg} title={t('home.tip')}></Item>
        <Item link='/trade' illustration={TradeImg} title={t('home.trade')}></Item>
        <Item tooltip={t('coming_soon')} link={'/' /*routeNames.giveaway */} illustration={GiveawayImg} title={t('home.giveaway')}></Item>
        <Item tooltip={t('coming_soon')} link={'/' /*routeNames.airdrop */} illustration={AirdropImg} title={t('home.airdrop')}></Item>
      </div>
      <ReactTooltip id='home' place='top'/>
    </div>
  );
};

export default Home;
