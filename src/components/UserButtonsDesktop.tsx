import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { UserState } from '../redux/types';
import DarkModeSwitch from './DarkModeSwitch';

import { Button, Avatar, Typography } from '@mui/material'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useTheme } from "@emotion/react";

interface UserMenu {
    isMobile: boolean;
    user: UserState | null;
    handleLogout: () => void;
}

const useNavStyles = (theme: any) => ({
    lastBtn: {
        marginLeft: '1em',
        fontWeight: "600"
    },
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
    userInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    btnsWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
});

const UserButtonDesktop: React.FC<UserMenu> = ({isMobile, user, handleLogout}) => {
    const theme = useTheme();
    const classes = useNavStyles(theme);

    if(isMobile) return null;

    return (
        <div>
            {user ? (
                <div style={classes.btnsWrapper}>
                <div style={classes.userInfo}>
                    <Avatar style={!isMobile ? classes.avatar: classes.avatar.mobileStyle}>
                    {user.username.slice(0, 1)}
                    </Avatar>
                    <Typography color="secondary" variant="body1">
                    {user.username}
                    </Typography>
                </div>
                <Button
                    color="secondary"
                    variant="outlined"
                    size="medium"
                    style={classes.lastBtn}
                    onClick={handleLogout}
                    startIcon={<PowerSettingsNewIcon />}
                >
                    Log Out
                </Button>
                <DarkModeSwitch isMobile={isMobile} />
                </div>
            ) : (
                <div>
                <Button
                    color="secondary"
                    variant="outlined"
                    size="medium"
                    style={{fontWeight: 600}}
                    component={RouterLink}
                    to="/login"
                    startIcon={<ExitToAppIcon />}
                >
                    Log In
                </Button>
                <Button
                    color="secondary"
                    variant="outlined"
                    size="medium"
                    style={classes.lastBtn}
                    component={RouterLink}
                    to="/signup"
                    startIcon={<PersonAddIcon />}
                >
                    Sign Up
                </Button>
                <DarkModeSwitch isMobile={isMobile} />
                </div>
            )}
        </div>
    );
};

export default UserButtonDesktop;
