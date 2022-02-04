import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { TradeList } from './TradeList';
import { TradePage } from './TradePage';

export const Trade = () => {
    return (
        <Routes>
            <Route path=":id" element={<TradePage />} />
            <Route index element={<TradeList />} />
        </Routes>
    );
};
