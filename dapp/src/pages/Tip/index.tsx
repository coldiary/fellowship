import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { TipCampaign } from './TipCampaign';
import { TipList } from './TipList';

export const Tip = () => {
    return (
        <Routes>
            <Route path=":id" element={<TipCampaign />} />
            <Route index element={<TipList />} />
        </Routes>
    );
};
