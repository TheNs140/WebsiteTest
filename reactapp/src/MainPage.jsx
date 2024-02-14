import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RandomCalc from './RandomCalc';
import WeatherPage from './WeatherPage';
import ILIAnalysis from './ILIAnalysis/ILIAnalysis';
import ReactComponent from './ILIAnalysis/Table';
import Hello from './Hello';

const MainPage = () => {
    return (
        <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route path='/' element={<Hello />} />
            <Route path='/weatherPage' element={<WeatherPage />} />
            <Route path='/randomCalc' element={<RandomCalc />} />
            <Route path='/LeakRupureBoundryEquation' element={<ILIAnalysis />} />

        </Routes>

    );
}

export default MainPage;