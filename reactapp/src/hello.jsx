import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from './App'

const Hello = () => {
  const { dataBaseName, setDataBaseName } = useContext(DatabaseContext);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databases, setDatabases] = useState([]);

    useEffect(() => {
    fetchData();
    }, []);

    const updateDatabaseName = () => {

    // Update the database name with the selected value
        setDataBaseName(selectedDatabase);

  };

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
  };

  return (
      <div>
          <h1>{dataBaseName }</h1>

      <h2>Available Databases:</h2>
      <select
        value={selectedDatabase}
        onChange={(e) => setSelectedDatabase(e.target.value)}
      >
        {databases &&
          databases.map((database, index) => (
            <option key={index} value={database}>
              {database}
            </option>
          ))}
      </select>
      <button onClick={updateDatabaseName}>Update Database Name</button>
      {/* Add any other components or UI elements as needed */}
    </div>
  );
};

export default Hello;