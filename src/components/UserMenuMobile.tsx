import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserState } from '../redux/types'; 
import { useTheme } from '@mui/material/styles';

import { IconButton, Menu, MenuItem, Avatar } from '@mui/material'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DarkModeSwitch from './DarkModeSwitch';
import CSS from "csstype";

const useNavStyles = (theme: any) => ({
    avatar: {
        width: theme.spacing(4.1),
        height: theme.spacing(4.1),
        marginRight: '0.4em',
        color: theme.palette.primary.main,
        backgroundColor: '#d3d3d3',
        mobileStyle: {
          width: theme.spacing(3.5),
          height: theme.spacing(3.5),
        },
    },
    btnsWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    userBtnMob: {
        padding: '0.1em',
    },
    menuIcon: {
        marginRight: '10px',
    },
    threeDotsBtn: {
        padding: '0.35em',
    },
});

interface UserMenu {
    isMobile: boolean;
    user: UserState | null;
    handleLogout: () => void;
}

const UserMenuMobile: React.FC<UserMenu> = ({isMobile, user, handleLogout}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const classes = useNavStyles(theme); 

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        handleCloseMenu();
        handleLogout();
    };

    if(!isMobile) return null;
    return (
     <div>
        <DarkModeSwitch isMobile={isMobile} />
        {user ? (
          <IconButton onClick={handleOpenMenu} style={classes.userBtnMob as CSS.Properties}>
            <Avatar style={classes.avatar as CSS.Properties}>
              {user.username.slice(0, 1)}
            </Avatar>
            <MoreVertIcon color="primary" />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleOpenMenu}
            color="primary"
            style={classes.threeDotsBtn as CSS.Properties}
          >
            <MoreVertIcon color="primary" />
          </IconButton>
        )}
  
        <Menu
          anchorEl={anchorEl} 
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          marginThreshold={0}
          elevation={1}
        >
          {user ? (
            <MenuItem onClick={handleLogoutClick}>
              <PowerSettingsNewIcon style={classes.menuIcon} />
              Logout: {user.username}
            </MenuItem>
          ) : (
            <div>
              <MenuItem
                component={RouterLink}
                to="/login"
                onClick={handleCloseMenu}
              >
                <ExitToAppIcon style={classes.menuIcon} />
                Log In
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/signup"
                onClick={handleCloseMenu}
              >
                <PersonAddIcon style={classes.menuIcon} />
                Sign Up
              </MenuItem>
            </div>
          )}
        </Menu>
      </div>
    );
}

export default UserMenuMobile;