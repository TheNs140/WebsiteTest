import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import RandomCalc from './RandomCalc';
import WeatherPage from './WeatherPage';
import Hello from './Hello';
import ILILeakRuptureBoundryAnalysis from './ILILeakRuptureBoundryAnalysis';

const mainPage = () => {
    return (
        <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route path='/' element={<Hello />} />
            <Route path='/weatherPage' element={<WeatherPage />} />
            <Route path='/randomCalc' element={<RandomCalc />} />
            <Route path='/LeakRupureBoundryEquation' element={<ILILeakRuptureBoundryAnalysis />} />
        </Routes>

    );
}

export default mainPage;