import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from './App'
import { Dropdown } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";



const FrontPage = () => {
    const navigate = useNavigate();
    const { dataBaseName, setDataBaseName } = useContext(DatabaseContext);
    
    const { inputList, setInputList } = useContext(DatabaseContext);
    const { isCalculated, setIsCalculated } = useContext(DatabaseContext);

    const [selectedDatabase, setSelectedDatabase] = useState({
        database: ''
    });

    const [databases, setDatabases] = useState([]);


    const [ collectionName, setCollectionName ] = useState('');
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState({
        collection: ''
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



            if (data.length > 0) {
                setSelectedDatabase(data[0]);
            }
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
                database: dataBaseName,
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

    const handleDatabaseChange = (e, { value }) => {
        
        setSelectedDatabase((prevOptions) => ({
            ...prevOptions,
            database: value
        }));
        setDataBaseName(value);
        fetchCollections();
    };

    const handleCollectionChange = (e, { value }) => {
        setSelectedCollection((prevOptions) => ({
            ...prevOptions,
            collection: value
        }));
        setCollectionName(value);
    };

    return (

        <div>
                <h1>ILI Inputs</h1>
            <form onSubmit={handleSubmission}>
                <Dropdown
                    placeholder='Select Database'
                    fluid
                    search
                    selection
                    options={databases.map((database, index) => ({
                        key: index,
                        text: database,
                        value: database,
                    }))}
                    onChange={handleDatabaseChange}
                />
                {collections.length > 0 && (
                    <Dropdown
                        placeholder='Select Collection'
                        fluid
                        search
                        selection
                        options={collections.map((collection, index) => ({
                            key: index,
                            text: collection,
                            value: collection,
                        }))}
                        onChange={handleCollectionChange}
                    />
                )}




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