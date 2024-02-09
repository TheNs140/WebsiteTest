import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Hello = () => {
    const databasename = dataBaseStore()
    return (<div>{databasename}</div>)
}
export default Hello;