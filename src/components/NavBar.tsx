import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState, logout } from '../redux/slices/authSlice';
import UserButtonsDesktop from './UserButtonsDesktop';
import UserMenuMobile from './UserMenuMobile';
import BugIcon from '../assets/bug.png';
import { AppBar, Toolbar, Button, useMediaQuery, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import CSS from "csstype";
import { useNavigate } from 'react-router-dom';

const useNavStyles = () => ({
    container: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    leftPortion: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
    },
    logoWrapper: {
        marginRight: '1em',
        display: 'flex',
        alignItems: 'center',
    },
    logoBtn: {
        textTransform: 'none',
        fontSize: '1.2em',
        padding: '0.1em',
        marginRight: '0.3em',
        mobileStyle: {
          fontSize: '1em',
          marginLeft: '0.6em',
        },
    },
    backBtn: {
        mobileStyle: {
          marginLeft: '0.6em',
        },
    },
    svgImage: {
        width: '35px',
        marginRight: '5px',
        mobileStyles: {
          width: '30px',
        },
    },    
});  

const NavBar = () => {
  const { user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useNavStyles();

  const handleLogout = () => {
    dispatch<any>(logout());
    navigate('/login');
  };

  const handleGoBack = () => {
    if (pathname.includes('/bugs')) {
      navigate(`${pathname.slice(0, pathname.indexOf('/bugs'))}`);
    } else {
      navigate('/');
    }
  };

  const mainButton = () => {
    if (['/', '/login', '/signup'].includes(pathname)) {
      return (
        <div style={classes.logoWrapper as CSS.Properties}>
          <Button
            style={!isMobile ? classes.logoBtn as CSS.Properties:classes.logoBtn.mobileStyle  as CSS.Properties}
            component={RouterLink}
            to="/"
            color="secondary"
          >
            <img src={BugIcon} alt="logo" style={!isMobile ? classes.svgImage as CSS.Properties: classes.svgImage.mobileStyles as CSS.Properties} />
            BugHound
          </Button> 
        </div>
      );
    } else {
      return (
        <Button
          startIcon={<ArrowBackIcon />}
          color="secondary"
          onClick={handleGoBack}
          style={!isMobile ? classes.backBtn as CSS.Properties:classes.backBtn.mobileStyle  as CSS.Properties}
        >
          {pathname.includes('/bugs') ? 'Project' : 'Home'}
        </Button>
      );
    }
  };

  return (
    <Container disableGutters={isMobile} style={classes.container as CSS.Properties}>
    <AppBar elevation={1} color="inherit" position="static">
      <Toolbar variant="dense" disableGutters={isMobile}>
        <div style={classes.leftPortion as CSS.Properties}>{mainButton()}</div>
        <UserButtonsDesktop
          isMobile={isMobile}
          user={user}
          handleLogout={handleLogout}
        />
        <UserMenuMobile
          isMobile={isMobile}
          user={user}
          handleLogout={handleLogout}
        />
      </Toolbar>
     </AppBar>
    </Container>
  );
};

export default NavBar;