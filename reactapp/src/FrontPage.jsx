import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from './App'
import { Dropdown } from 'semantic-ui-react'


const FrontPage = () => {
    const { dataBaseName, setDataBaseName } = useContext(DatabaseContext);
    const { metalLossList, setMetalLossList } = useContext(DatabaseContext);
    const { inputList, setInputList } = useContext(DatabaseContext);
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [databases, setDatabases] = useState([]);

    const [inputValues, setInputValues] = useState({
        OuterDiameter: '',
        YieldStrength: '',
        FullSizedCVN: '',
        PressureOfInterest: '',
        WallThickness: '',
        SafetyFactor: '',
    });


    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const response = await fetch('/database');
            const data = await response.json();




            setDatabases(data);
            // Set the default selected database (optional)
            if (data.length > 0) {
                setSelectedDatabase(data[0]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchMetalLossList = async () => {

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataBaseName)
        };

        const response = await fetch('/metalloss', requestOptions);
        setMetalLossList(await response.json());
    }


    const handleSubmission =(e) => {

        e.preventDefault();
        setInputList(inputValues);
        fetchMetalLossList();
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [name]: value,
        }));
    }; 
    return (

      <div>
            <h1>{dataBaseName}</h1>
            <h1>{inputList.OuterDiameter}</h1>
            <form onSubmit={handleSubmission}>
                <Dropdown
                    placeholder='Select DataBase'
                    fluid
                    search
                    selection
                    options={databases.map((database, index) => ({
                        key: index,
                        text: database,
                        value: database,
                    }))}
                    onChange={(e, { value }) => setDataBaseName(value)}
                />


                <label htmlFor="OuterDiameter">Outer Diameter</label>
                <input type="text" id="OuterDiameter" name="OuterDiameter" value={inputValues.OuterDiameter} onChange={handleInputChange} />

                <label htmlFor="YieldStrength">Yield Strength</label>
                <input type="text" id="YieldStrength" name="YieldStrength" value={inputValues.YieldStrength} onChange={handleInputChange} />

                <label htmlFor="FullSizedCVN">Full Sized CVN</label>
                <input type="text" id="FullSizedCVN" name="FullSizedCVN" value={inputValues.FullSizedCVN} onChange={handleInputChange} />

                <label htmlFor="PressureOfInterest">Pressure of Interest</label>
                <input type="text" id="PressureOfInterest" name="PressureOfInterest" value={inputValues.PressureOfInterest} onChange={handleInputChange} />

                <label htmlFor="WallThickness">Wall Thickness</label>
                <input type="text" id="WallThickness" name="WallThickness" value={inputValues.WallThickness} onChange={handleInputChange} />

                <label htmlFor="SafetyFactor">Safety Factor</label>
                <input type="text" id="SafetyFactor" name="SafetyFactor" value={inputValues.SafetyFactor} onChange={handleInputChange} />

                <button type="submit">Calculate</button>
            </form>
    </div>
  );
};

export default FrontPage;