import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FrontPage from './FrontPage';
import TableComponent from './ILIAnalysis/Table';
import MainChartApplication from './ILIAnalysis/ILIAnalysisChart';
import DigListTableComponent from './ILIAnalysis/DigList';
import { DatabaseContext } from './App';
import PreAnalysisChart from './PreAnalysis/PreAnalysisChart';


const Router = () => {

    const { isCalculated, setIsCalculated } = useContext(DatabaseContext);


    useEffect(() => {
        if (!isCalculated) {
            <Navigate to='/' replace></Navigate>;
        }
    });

    return (

        <Routes>
            {/* The Switch decides which component to show based on the current URL. */}
            <Route path='/' element={<FrontPage />} />
            {isCalculated ? (
                <>
                    <Route path='/Table' element={<TableComponent />} />
                    <Route path='/Chart' element={<MainChartApplication />} />
                    <Route path='/DigList' element={<DigListTableComponent />} />
                    <Route path='/PreAnalysisChart  `' element={<PreAnalysisChart/>} />

                </>
            ) : (
                <Route
                    path='/*'
                    element={
                        <Navigate to='/' replace />
                    }
                />
            )}
        </Routes>

    );
}

export default Router;