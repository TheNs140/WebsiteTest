import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from './App'
import { Dropdown } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import "./FrontPageStyling.css";


const FrontPage = () => {
    const navigate = useNavigate();
    
    const { inputList, setInputList } = useContext(DatabaseContext);
    const { isCalculated, setIsCalculated } = useContext(DatabaseContext);

    const [selectedDatabase, setSelectedDatabase] = useState({
        database: null
    });

    const [databases, setDatabases] = useState([]);


    const [ collectionName, setCollectionName ] = useState('');
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState({
        collection: null
    });



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

    useEffect(() => {
        if (selectedDatabase.database) {
            fetchCollections();
        }
    }, [selectedDatabase]);


    const fetchData = async () => {
        try {

            const response = await fetch('/database');
            const data = await response.json();




            setDatabases(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }


    }

    const fetchCollections = async () => {

        try {

            let options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( selectedDatabase.database)
            };


            const response = await fetch('/collection', options);
            const data = await response.json();




            setCollections(collections => data);
            // Set the default selected database (optional)
            if (data.length > 0) {
                setSelectedCollection(data[0]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const handleSubmission = async(e) => {


        e.preventDefault();
        setInputList(inputValues);
        await getMetalLossFeatures();

    }

    async function getMetalLossFeatures()
    {

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                database: selectedDatabase.database,
                collection: collectionName
            })
        };

        const response = await fetch('metalloss', requestOptions);
        const data = await response.json();
        let metalLoss = data;

        await sessionStorage.setItem('metalLoss', JSON.stringify(metalLoss))
        setIsCalculated(true);


        navigate('/Table');

    }

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [name]: value,
        }));
    }; 

    const handleDatabaseChange = (event) => {
        const { value } = event.target;

        setSelectedDatabase((prevOptions) => ({
            database: value,
        }));

    };

    const handleCollectionChange = (event) => {

        const { value } = event.target;


        setSelectedCollection((prevOptions) => ({
            ...prevOptions,
            collection: value
        }));
        setCollectionName(value);
    };

    return (

        <div>
            <h1>Database Selection</h1>

            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Database</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDatabase.database || ''}
                    label="Database"
                    onChange={handleDatabaseChange}
                >
                    {databases.map((value) => (
                        <MenuItem key={value} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
                {collections.length > 0 && (
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Collection</InputLabel>

                         <Select
                            labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCollection.collection || ''}
                            label="Collection"
                            onChange={handleCollectionChange}
                        >
                            {collections.map((value) => (
                                <MenuItem key={value} value={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                )}
            <h1>Pipeline Inputs</h1>


            <div className={"input-form" }>
                <form onSubmit={handleSubmission}>
                    <label htmlFor="OuterDiameter">Diameter (mm)</label>
                    <input type="text" id="OuterDiameter" name="OuterDiameter" value={inputValues.OuterDiameter} onChange={handleInputChange} />

                    <label htmlFor="WallThickness">Wall Thickness (mm)</label>
                    <input type="text" id="WallThickness" name="WallThickness" value={inputValues.WallThickness} onChange={handleInputChange} />

                    <label htmlFor="YieldStrength">Grade (MPa)</label>
                    <input type="text" id="YieldStrength" name="YieldStrength" value={inputValues.YieldStrength} onChange={handleInputChange} />

                    <label htmlFor="FullSizedCVN">CVN Toughness (J)</label>
                    <input type="text" id="FullSizedCVN" name="FullSizedCVN" value={inputValues.FullSizedCVN} onChange={handleInputChange} />

                    <label htmlFor="PressureOfInterest">MOP (kPa)</label>
                    <input type="text" id="PressureOfInterest" name="PressureOfInterest" value={inputValues.PressureOfInterest} onChange={handleInputChange} />

                    <label htmlFor="SafetyFactor">Safety Factor</label>
                    <input type="text" id="SafetyFactor" name="SafetyFactor" value={inputValues.SafetyFactor} onChange={handleInputChange} />

                    <button type="submit">Calculate</button>
                </form>

                <form onSubmit={handleSubmission}>
                    <label htmlFor="OuterDiameter">Internal Corrosion Rate (mm/yr)</label>
                    <input type="text" id="OuterDiameter" name="OuterDiameter" value={inputValues.OuterDiameter} onChange={handleInputChange} />

                    <label htmlFor="WallThickness">External Corrosion Rate (mm/yr)</label>
                    <input type="text" id="WallThickness" name="WallThickness" value={inputValues.WallThickness} onChange={handleInputChange} />

                    <label htmlFor="YieldStrength">Stress Corrosion Cracking Rate (mm/yr)</label>
                    <input type="text" id="YieldStrength" name="YieldStrength" value={inputValues.YieldStrength} onChange={handleInputChange} />

                    <label htmlFor="FullSizedCVN">Paris Law Coefficient (Pa,sqr(m))</label>
                    <input type="text" id="FullSizedCVN" name="FullSizedCVN" value={inputValues.FullSizedCVN} onChange={handleInputChange} />

                    <label htmlFor="PressureOfInterest">Paris Law Exponent</label>
                    <input type="text" id="PressureOfInterest" name="PressureOfInterest" value={inputValues.PressureOfInterest} onChange={handleInputChange} />

                    <label htmlFor="SafetyFactor">Cyclic Index (cycles/year)</label>
                    <input type="text" id="SafetyFactor" name="SafetyFactor" value={inputValues.SafetyFactor} onChange={handleInputChange} />

                    <label htmlFor="SafetyFactor">Basis of Cyclic Index (%SMYS)</label>
                    <input type="text" id="SafetyFactor" name="SafetyFactor" value={inputValues.SafetyFactor} onChange={handleInputChange} />

                    <button type="submit">Calculate</button>
                </form>
            </div>
    </div>
  );
};

export default FrontPage;