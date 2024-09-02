import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { FaRegBell } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import SearchBox from '../SearchBox';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions'; // Make sure this is the correct path

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const context = useContext(MyContext);

    const handleLogout = () => {
        dispatch(actions.logout()); // Call logout action
        navigate('/login'); // Redirect to login page
    };

    return (
        <header className='fixed top-0 right-0 bg-white py-3 z-[100] flex items-center justify-center px-4'>
            <SearchBox />
            <div className='ml-auto part2'>
                <ul className='flex items-center gap-3'>
                    <li>
                        <Button><FaRegBell /></Button>
                    </li>
                    <li>
                        <Button><MdOutlineEmail /></Button>
                    </li>
                    <li>
                        <div className='myAcc' onClick={handleClick}>
                            <div className="userImg">
                                <span className="rounded-circle">
                                    {context.user && context.user.name ? context.user.name.charAt(0) : 'U'}
                                </span>
                            </div>
                            <div className='user-info'>
                                <div className="user-name">{context.user?.name}</div>
                                <div className="user-email">{context.user?.email}</div>
                            </div>
                        </div>

                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleClose}>
                                <Avatar /> Profile
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Avatar /> My account
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                Add another account
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                <span onClick={handleLogout}>Logout</span>
                            </MenuItem>
                        </Menu>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default Header;
