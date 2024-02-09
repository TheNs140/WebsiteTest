import React, { Component } from 'react';
import MainPagejsx from './MainPage';
import { create } from 'zustand';


const dataBaseStore = create((set) => ({
    dataBaseName: 'here',
    setDataBaseName: (dataBaseName) => set({ dataBaseName }),

}));

function App() {
    return (
        <div className="App">
            <MainPagejsx />

        </div>
    );
}

export default App;