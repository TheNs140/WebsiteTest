import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Main.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./NavBar.jsx";
import 'semantic-ui-css/semantic.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <NavBar />
    <App />
  </BrowserRouter>,
)
