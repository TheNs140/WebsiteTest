import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import 'semantic-ui-css/semantic.min.css'
import './main.css'
import Sidebar from './NavBar/SideBar';


ReactDOM.createRoot(document.getElementById('root')).render(
    <div id = "outer-container">
        <BrowserRouter>
            <Sidebar />
            <main id="App">
                <App />
            </main>
        </BrowserRouter>
    </div>,
)
