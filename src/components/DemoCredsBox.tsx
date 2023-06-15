import { Alert, AlertTitle } from '@mui/lab';

const demoCredentials = "Username: 'test' & Password: 'password'"; 

const DemoCredsBox = () => {
  return (
    <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
      <Alert severity="info">
        <AlertTitle>Demo Account Credentials</AlertTitle>
        {demoCredentials}
      </Alert>
    </div>
  );
};

export default DemoCredsBox;