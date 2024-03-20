import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from './App'
import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import "./FrontPageStyling.css";


const FrontPage = () => {
    const navigate = useNavigate();
    
    const { inputList, setInputList } = useContext(DatabaseContext);
    const { analysisInputList, setAnalysisInputList } = useContext(DatabaseContext);
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

    const [analysisInput, setAnalysisInput] = useState({
        InternalCorrosionRate: '',
        ExternalCorrosionRate: '',
        StressCorrosionCrackingRate: '',
        ParisLawCoefficient: '',
        ParisLawExponent: '',
        CyclicIndex: '',
        BasisOfCyclicIndex: '',

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
        setAnalysisInputList(analysisInput);
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

    const handleAnalysisInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setAnalysisInput((prevInputValues) => ({
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

        <div className={"front-page-input" }>
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

                </form>

                <form onSubmit={handleSubmission}>
                    <label htmlFor="InternalCorrosionRate">Internal Corrosion Rate (mm/yr)</label>
                    <input type="text" id="InternalCorrosionRate" name="InternalCorrosionRate" value={analysisInput.InternalCorrosionRate} onChange={handleAnalysisInputChange} />

                    <label htmlFor="ExternalCorrosionRate">External Corrosion Rate (mm/yr)</label>
                    <input type="text" id="ExternalCorrosionRate" name="ExternalCorrosionRate" value={analysisInput.ExternalCorrosionRate} onChange={handleAnalysisInputChange} />

                    <label htmlFor="StressCorrosionCrackingRate">Stress Corrosion Cracking Rate (mm/yr)</label>
                    <input type="text" id="StressCorrosionCrackingRate" name="StressCorrosionCrackingRate" value={analysisInput.StressCorrosionCrackingRate} onChange={handleAnalysisInputChange} />

                    <label htmlFor="ParisLawCoefficient">Paris Law Coefficient (Pa,sqr(m))</label>
                    <input type="text" id="ParisLawCoefficient" name="ParisLawCoefficient" value={analysisInput.ParisLawCoefficient} onChange={handleAnalysisInputChange} />

                    <label htmlFor="ParisLawExponent">Paris Law Exponent</label>
                    <input type="text" id="ParisLawExponent" name="ParisLawExponent" value={analysisInput.ParisLawExponent} onChange={handleAnalysisInputChange} />

                    <label htmlFor="CyclicIndex">Cyclic Index (cycles/year)</label>
                    <input type="text" id="CyclicIndex" name="CyclicIndex" value={analysisInput.CyclicIndex} onChange={handleAnalysisInputChange} />

                    <label htmlFor="BasisOfCyclicIndex">Basis of Cyclic Index (%SMYS)</label>
                    <input type="text" id="BasisOfCyclicIndex" name="BasisOfCyclicIndex" value={analysisInput.BasisOfCyclicIndex} onChange={handleAnalysisInputChange} />

                </form>
            </div>
            <button type="submit" onClick={handleSubmission}>Calculate</button>

    </div>
  );
};

export default FrontPage;