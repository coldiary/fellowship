import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CampaignList } from './CampaignList';
import { CampaignPage } from './CampaignPage';

export const Tip = () => {
    return (
        <Routes>
            <Route path=":id" element={<CampaignPage />} />
            <Route index element={<CampaignList />} />
        </Routes>
    );
};
