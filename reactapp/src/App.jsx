import React, { Component, useState, useContext } from 'react';
import Router from './Router';


const DatabaseContext = React.createContext(null);
function App() {

    //These are all the states that are used in the app

    const [isCalculated, setIsCalculated] = useState(false);
    const [inputList, setInputList] = useState([]);
    const [metalLossList, setMetalLossList] = useState([]);
    const contextValue = {
        inputList,
        setInputList,
        metalLossList,
        setMetalLossList,
        isCalculated,
        setIsCalculated

    };


    //This is returning the rendered Router component
    return (
        <DatabaseContext.Provider value={contextValue} >
            <Router />
         </DatabaseContext.Provider>
    );
}
export default App;
export { DatabaseContext };
