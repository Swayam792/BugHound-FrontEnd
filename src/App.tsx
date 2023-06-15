import React, { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from "@mui/material";
import customTheme from './styles/customTheme'; 
import { selectThemeState, toggleDarkMode } from './redux/slices/themeSlice';
import { useTheme } from '@mui/material/styles';
import { autoLogin } from './redux/slices/authSlice';  
import storage from './utils/localStorage'; 
import CSS from "csstype";
import NavBar from './components/NavBar';
import Routes from './Routes';
import ToastNotification from './components/ToastNotification';

const useBodyStyles = (darkMode: boolean) => ({
  root: {
    width: '100vW',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: '100vH',
    backgroundColor: darkMode ? '#333' : '#00968810',
  },
});  

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(selectThemeState);
  const theme = useTheme();
  const classes = useBodyStyles(darkMode);

  useEffect(() => {
    dispatch<any>(autoLogin());
  },[]);

  useEffect(() => {
    const loadedDarkMode = storage.loadDarkMode();
    if (loadedDarkMode && !darkMode) {
      dispatch<any>(toggleDarkMode());
    } 
  }, []);

  return (
    <ThemeProvider theme={customTheme(darkMode)}>
      <div style={classes.root as CSS.Properties}>
        <NavBar />
        <Routes />
        <ToastNotification />
      </div>
    </ThemeProvider>
  );
}

export default App;
