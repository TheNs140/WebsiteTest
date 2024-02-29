import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "./SubMenuStyle.css"
import { Link } from 'react-router-dom'


export function SubMenu() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                ILI Analysis
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
            <Link to='/Table' className="nav-link">
                <MenuItem onClick={handleClose}>
                    Table
                </MenuItem>
             </Link>
            <Link to='/Chart' className="nav-link">
                <MenuItem onClick={handleClose}>Charts</MenuItem>
                </Link>
            </Menu>


        </div>
    );
}