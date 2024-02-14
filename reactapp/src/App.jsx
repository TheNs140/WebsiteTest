import React, { Component, useState, useContext } from 'react';
import MainPage from './MainPage';


const DatabaseContext = React.createContext(null);
function App() {

    const [dataBaseName, setDataBaseName] = useState(null);


    const contextValue = {
        dataBaseName,
        setDataBaseName
    };

    return (
        <div className="App">
            <DatabaseContext.Provider value={contextValue} >
                <MainPage />
            </DatabaseContext.Provider>
        </div>
    );
}
export default App;
export { DatabaseContext };
