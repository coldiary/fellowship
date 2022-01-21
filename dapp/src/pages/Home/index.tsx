import React, { FC }  from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import AirdropImg from 'assets/img/home/airdrop.svg';
import FundImg from 'assets/img/home/fund.svg';
import GiveawayImg from 'assets/img/home/giveaway.svg';
import KickstartImg from 'assets/img/home/kickstart.svg';
import TipImg from 'assets/img/home/tip.svg';
import TradeImg from 'assets/img/home/trade.svg';
import { routeNames } from 'routes';

interface ItemProps {
  illustration: string;
  title: string;
  link: string;
  tooltip?: string;
}

const Item: FC<ItemProps> = (props) => (
  <Link to={props.link} className='bg-white border rounded-xl p-6 hover:shadow-md'>
    <div className="h-full flex flex-col items-center" {...(props.tooltip ? {
      'data-tip': props.tooltip,
      'data-for': 'home',
    }: {})}>
      <div className='h-40 flex items-center justify-center'>
        <img className='h-full' src={props.illustration} alt="" />
      </div>
      <div className="m-6 flex-auto flex justify-center items-center">
        <div className='text-2xl font-medium text-center hover:text-main'>
          {props.title}
        </div>
      </div>
    </div>
  </Link>
);

const Home = () => {
  return (
    <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto'>
      <div className="grid grid-cols-3 gap-12">
        <Item tooltip="test" link={'/' /*routeNames.kickstart */} illustration={KickstartImg} title='Start your project with funds from the community'></Item>
        <Item tooltip="test" link={'/' /*routeNames.giveaway */} illustration={FundImg} title='Collect funds for a cause'></Item>
        <Item link={routeNames.tip} illustration={TipImg} title='Support your favorite creators and builders'></Item>
        <Item tooltip="test" link={'/' /*routeNames.trade */} illustration={TradeImg} title='Trade you assets with confidence'></Item>
        <Item tooltip="test" link={'/' /*routeNames.giveaway */} illustration={GiveawayImg} title='Make your followers win assets in a fair way'></Item>
        <Item tooltip="test" link={'/' /*routeNames.airdrop */} illustration={AirdropImg} title='Distribute assets easily'></Item>
      </div>
      <ReactTooltip id='home' place='top'/>
    </div>
  );
};

export default Home;
