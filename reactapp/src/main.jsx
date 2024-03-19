import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Link } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import 'semantic-ui-css/semantic.min.css'
import './main.css'
import Sidebar from './NavBar/SideBar';
import NC from './assets/NC.png'

ReactDOM.createRoot(document.getElementById('root')).render(
    
    <div id = "outer-container">
        {
        }
        <BrowserRouter>
            <Sidebar />
            <Link to='/' replace className={"image-link"}>
                <img src={NC} width={200} display={"block"} />
            </Link>
            <main id="App">
                <App />
            </main>
        </BrowserRouter>
    </div>,
)
