import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ILIAnalysis from './ILIAnalysis/ILIAnalysis';
import FrontPage from './FrontPage';

const Router = () => {
    return (
        <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route path='/' element={<FrontPage />} />
            <Route path='/ILIAnalysis' element={<ILIAnalysis />} />
        </Routes>

    );
}

export default Router;