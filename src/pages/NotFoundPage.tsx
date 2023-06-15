import { Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import Error404 from '../assets/bug.svg';

const useMainPageStyles = () => ({
    root: {
        padding: '1em 0',
        mobileStyles: {
            padding: '0.5em 0.5em',
        },
    },
    notFoundPaper: {
        padding: '1.5em',
        minHeight: 'calc(100vH - 130px)',
        mobileStyles: {
            padding: '0.5em 0.7em',
            minHeight: 'calc(100vH - 80px)',
        },
    },
    notFoundWrapper: {
        marginTop: '6em',
    },
    error404Image: {
        width: '250px',
        display: 'block',
        margin: '0 auto',
        mobileStyles: {
            width: '150px',
        },
    },
    error404Text: {
        fontSize: '2.2em',
        textAlign: 'center',
        marginTop: '1em',
        mobileStyles: {
            fontSize: '1.5em',
        },
    },
});

const NotFoundPage = () => {
    const classes = useMainPageStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div style={!isMobile ? classes.root : classes.root.mobileStyles}>
            <Paper style={!isMobile ? classes.notFoundPaper : classes.notFoundPaper.mobileStyles}>
                <div style={classes.notFoundWrapper}>
                    <img src={Error404} alt="404" style={!isMobile ? classes.error404Image : classes.error404Image.mobileStyles} />
                    <Typography
                        color="secondary"
                        variant="h6"
                        style={!isMobile ? classes.error404Text : classes.error404Text.mobileStyles}
                    >
                        ERROR: Page Not Found!
                    </Typography>
                </div>
            </Paper>
        </div>
    );
};

export default NotFoundPage;
