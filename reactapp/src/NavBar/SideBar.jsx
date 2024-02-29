import React from 'react';
import { push as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom'
import './SideBar.css';
import { SubMenu } from './SubMenu/SubMenu.jsx';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


const Sidebar = () => {

    return(
        <Menu pageWrapId={'App'} outerContainerId={'outer-container'} >
            <Stack spacing={1} alignItems="center">
                <Link to='/' className="nav-link">
                   <Button variant="text">
                        Input Page
                    </Button>
                </Link>

                <SubMenu />
            </Stack>

        </Menu>
    )
    };
export default Sidebar;