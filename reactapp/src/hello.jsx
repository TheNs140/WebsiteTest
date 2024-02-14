import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from './App'
import { Dropdown } from 'semantic-ui-react'


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

          <Dropdown
              placeholder='Select Country'
              fluid
              search
              selection
              options={databases.map((database, index) => ({
                  key: index,
                  text: database,
                  value: database,
              }))}
              onChange={(e, { value }) => setDataBaseName(value)}
              loading
          />
    </div>
  );
};

export default Hello;