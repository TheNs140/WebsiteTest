import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import RandomCalc from './RandomCalc';
import WeatherPage from './WeatherPage';
import Hello from './Hello';

const mainPage = () => {
    return (
        <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route path='/' element={<Hello />} />
            <Route path='/weatherPage' element={<WeatherPage />} />
            <Route path='/randomCalc' element={ <RandomCalc/> } />
        </Routes>

    );
}

export default mainPage;