import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError, selectAuthState } from '../redux/slices/authSlice';
import ErrorBox from '../components/ErrorBox';
import DemoCredsBox from '../components/DemoCredsBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BugIcon from '../assets/bug.jpg';

import {
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Link,
    Paper,
    useMediaQuery,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material'; 

interface InputValues {
    username: string;
    password: string;
}

const validationSchema = yup.object({
    username: yup.string().required('Required'),
    password: yup.string().required('Required'),
});

const useAuthPageStyles = () => ({
    root: {
        padding: '1.5em 3em',
        width: '330px',
        margin: 'auto',
        marginTop: '16vH',
        mobileStyles: {
            width: 'auto',
            margin: '0.5em 0.5em',
            padding: '1em',
        },
    },
    form: {
        marginTop: '3em',
    },
    inputField: {
        marginBottom: '1.5em',
    },
    submitButton: {
        marginTop: '0.5em',
        height: '3.1em',
        fontSize: '1em',
        fontWeight: 500,
    },
    titleLogo: {
        display: 'block',
        width: '7em',
        margin: '0 auto',
        mobileStyles: {
            width: '6em',
        },
    },
    footerText: {
        marginTop: '1em',
        textAlign: 'center',
    },
    link: {
        cursor: 'pointer',
    },
});

const LoginPage = () => { 
    const classes = useAuthPageStyles();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(selectAuthState);
    const [showPass, setShowPass] = useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { register, handleSubmit, formState: { errors } } = useForm<InputValues>({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
    });

    const handleLogin = ({ username, password}: InputValues) => {
        dispatch<any>(login({ username, password }));
    }; 
    return (
        <div>
            <Paper style={!isMobile ? classes.root: classes.root.mobileStyles} elevation={2}>
                <img src={BugIcon} alt="bug-logo" style={classes.titleLogo} />
                <form onSubmit={handleSubmit(handleLogin)} style={classes.form}>
                    <div style={classes.inputField}>
                        <TextField
                            required
                            fullWidth
                            {...register("username")}
                            name="username"
                            type="text"
                            label="Username"
                            variant="outlined"
                            error={errors.username as any}
                            helperText={errors.username ? errors.username.message as any: ''}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div style={classes.inputField}>
                        <TextField
                            required
                            fullWidth
                            {...register("password")}
                            name="password"
                            type={showPass ? 'text' : 'password'}
                            label="Password"
                            variant="outlined"
                            error={errors.password as any}
                            helperText={errors.password ? errors.password.message as any : ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPass((prevState) => !prevState)}
                                            size="small"
                                        >
                                            {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<ExitToAppIcon />}
                        type="submit"
                        style={classes.submitButton}
                        disabled={loading}
                    >
                        Log In
                    </Button>
                </form>
                <Typography variant="body1" style={classes.footerText as any}>
                    Don’t have an account?{' '}
                    <Link
                        style={classes.link}
                        component={RouterLink}
                        to="/signup"
                        color="secondary"
                    >
                        Sign Up
                    </Link>
                </Typography>
                {error && (
                    <ErrorBox
                        errorMsg={error}
                        clearErrorMsg={() => dispatch(clearAuthError())}
                    />
                )}
                <DemoCredsBox />
            </Paper>
        </div>
    );
}

export default LoginPage;