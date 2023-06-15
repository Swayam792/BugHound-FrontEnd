import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode, selectThemeState } from '../redux/slices/themeSlice';
import storage from '../utils/localStorage';

import { IconButton, Button } from '@material-ui/core';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';

const DarkModeSwitch: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(selectThemeState);

  const handleDarkMode = () => {
    dispatch(toggleDarkMode());
    storage.saveDarkMode(!darkMode);
  };
  console.log(darkMode);
  if (isMobile) {
    return (
      <IconButton
        color="primary"
        style={{ padding: '0.35em' }}
        onClick={handleDarkMode}
      >
        {darkMode ? (
          <NightsStayOutlinedIcon color="primary" />
        ) : (
          <WbSunnyOutlinedIcon color="primary" />
        )}
      </IconButton>
    );
  }

  return (
    <Button
      color="secondary"
      size="small"
      variant="outlined"
      onClick={handleDarkMode}
      style={{
        minWidth: 0,
        padding: '0.3em',
        borderRadius: '2em',
        marginLeft: '1em',
      }}
    >
      {darkMode ? <NightsStayOutlinedIcon /> : <WbSunnyOutlinedIcon />}
    </Button>
  );
};

export default DarkModeSwitch;
