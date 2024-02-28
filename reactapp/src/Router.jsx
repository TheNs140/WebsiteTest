import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ILIAnalysis from './ILIAnalysis/ILIAnalysis';
import FrontPage from './FrontPage';
import TableComponent from './ILIAnalysis/Table';
import MainChartApplication from './ILIAnalysis/Charts';


const Router = () => {
    return (
        <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route path='/' element={<FrontPage />} />
            <Route path='/Table' element={<TableComponent />} />
            <Route path='/Chart' element={<MainChartApplication />} />

        </Routes>

    );
}

export default Router;