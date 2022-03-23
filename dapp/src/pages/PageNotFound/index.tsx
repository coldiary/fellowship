import * as React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const PageNotFound = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  return (
    <div className='d-flex flex-fill align-items-center container m-auto'>
      <div className='row w-100'>
        <div className='col-12 col-md-8 col-lg-5 mx-auto'>
          <div className='card p-4'>
            <div className='card-body text-center d-flex flex-column justify-content-center'>
              <div className='dapp-icon icon-medium'>
                <FontAwesomeIcon
                  icon={faSearch}
                  className='mx-auto text-muted fa-3x mb-2'
                />
              </div>
              <span className='h4 empty-heading mt-3'>{t('page_not_found')}</span>
              <span className='empty-details'>{pathname}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
