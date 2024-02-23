import React, { Component, useState, useContext } from 'react';
import Router from './Router';


const DatabaseContext = React.createContext(null);
function App() {

    const [dataBaseName, setDataBaseName] = useState(null);
    const [inputList, setInputList] = useState([]);


    const contextValue = {
        dataBaseName,
        setDataBaseName,
        inputList,
        setInputList
    };

    return (

        <DatabaseContext.Provider value={contextValue} >
            <Router />
        </DatabaseContext.Provider>
    );
}
export default App;
export { DatabaseContext };
