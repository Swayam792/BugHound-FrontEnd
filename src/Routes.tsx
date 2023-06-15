import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes as Routers } from 'react-router-dom';
import { selectAuthState } from './redux/slices/authSlice';
import { useTheme } from '@mui/material';
import { Container, useMediaQuery } from '@mui/material';
import storage from './utils/localStorage';
import LoginPage from './pages/LoginPage';
import { Navigate } from 'react-router-dom'; 
import SignupPage from './pages/SignupPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import BugsDetailsPage from './pages/BugsDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

const Routes = () => {
    const { user } = useSelector(selectAuthState);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isLoggedIn = storage.loadUser() || user;

    return (
        <Container disableGutters={isMobile}> 
        <Routers> 
            <Route path="/" element= {isLoggedIn ? <ProjectsPage /> : <Navigate to="/login" />} /> 
            <Route path="/projects/:projectId" element = {isLoggedIn ? <ProjectDetailsPage /> : <Navigate to="/login" />} /> 
            <Route path="/projects/:projectId/bugs/:bugId" element={user ? <BugsDetailsPage /> : <Navigate to="/" />} /> 
            <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} /> 
            <Route path="/signup" element={!isLoggedIn ? <SignupPage /> : <Navigate to="/" />} />             
            <Route element={ <NotFoundPage />} /> 
        </Routers>
    </Container>
    );
}

export default Routes;