import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";

import weatherPage from './weatherPage';
import hello from './hello';

const mainPage = () => {
    return (
        <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/' element={<hello />} />
            <Route exact path='/weatherPage' element={<weatherPage/>}/>
        </Routes>

    );
}

export default mainPage;