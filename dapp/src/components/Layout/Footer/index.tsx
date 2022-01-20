import React from 'react';
import { ReactComponent as HeartIcon } from '../../../assets/img/heart.svg';

const Footer = () => {
  return (
    <footer className='flex justify-center items-center mt-2 mb-3'>
        <a {...{target: '_blank'}} className='flex items-center' href='https://elrond.com/'>
          Made with <HeartIcon className='mx-1' fill='#ff0000' /> for the Elrond Community.
        </a>
    </footer>
  );
};

export default Footer;
