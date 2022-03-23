import React from 'react';
import { Trans } from 'react-i18next';

import { ReactComponent as HeartIcon } from '../../assets/img/heart.svg';

const Footer = () => {
  return (
    <footer className='flex flex-col justify-center items-center mt-2 mb-3'>
        <a {...{target: '_blank'}} className='flex items-center' href='https://elrond.com/'>
          <Trans i18nKey='footerMessage'>
            Made with <HeartIcon className='mx-1' fill='#ff0000' /> for the Elrond Community.
          </Trans>
        </a>
        <div className="opacity-50">v0.0.1</div>
    </footer>
  );
};

export default Footer;
