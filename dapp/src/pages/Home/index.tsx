import React, { FC }  from 'react';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import AirdropImg from '../../assets/img/home/airdrop.svg';
import FundImg from '../../assets/img/home/fund.svg';
import GiveawayImg from '../../assets/img/home/giveaway.svg';
import KickstartImg from '../../assets/img/home/kickstart.svg';
import TipImg from '../../assets/img/home/tip.svg';
import TradeImg from '../../assets/img/home/trade.svg';

interface ItemProps {
  illustration: string;
  title: string;
  link: string;
}

const Item: FC<ItemProps> = (props) => (
  <Link to={props.link} className='bg-white border rounded-xl p-6 hover:shadow-md'>
    <div className="h-full flex flex-col items-center">
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
  return (
    <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto'>
      <div className="grid grid-cols-3 gap-12">

        <Item link={routeNames.kickstart} illustration={KickstartImg} title='Start your project with funds from the community'></Item>
        <Item link={routeNames.giveaway} illustration={FundImg} title='Collect funds for a cause'></Item>
        <Item link={routeNames.tip} illustration={TipImg} title='Support your favorite creators and builders'></Item>
        <Item link={routeNames.trade} illustration={TradeImg} title='Trade you assets with confidence'></Item>
        <Item link={routeNames.giveaway} illustration={GiveawayImg} title='Make your followers win assets in a fair way'></Item>
        <Item link={routeNames.airdrop} illustration={AirdropImg} title='Distribute assets easily'></Item>

      </div>
    </div>
  );
};

export default Home;
