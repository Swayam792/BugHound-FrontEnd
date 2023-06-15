import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjectsState } from '../redux/slices/projectsSlice';
import ProjectsTable from './ProjectsTable';
import ProjectActionCard from './ProjectActionCard';
import ProjectsListMobile from './ProjectListMobile';
import sortProjects from '../utils/sortProjects';
import LoadingSpinner from '../components/LoadingSpinner';
import InfoText from '../components/InfoText';
import ProjectSymbol from "../assets/projects.png"

import { Paper, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material'; 
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const useMainPageStyles = () => ({
  root: {
    padding: '1em 0',
    mobileStyle: {
      padding: '0.5em 0.5em',
    },
  },
  headerPaper: {
    padding: '0.8em 1.5em',
    marginBottom: '1em',
    display: 'flex',
    alignItems: 'center',
    mobileStyle: {
      padding: '0.3em 0.5em',
      marginBottom: '0.5em',
    },
  },
  headerIcon: {
    width: '5.5em',
    height: '4.5em',
    marginRight: '0.2em',
    mobileStyle: {
      width: '4.5em',
      height: '3em',
      marginRight: '0.3em',
    },
  },
  projectsPaper: {
    padding: '1.5em',
    minHeight: 'calc(100vH - 244px)',
    mobileStyle: {
      padding: '0.7em 0.3em',
      minHeight: 'calc(100vH - 160px)',
    },
  },
  projectsListTable: {
    marginTop: '1.5em',
    mobileStyles: {
      marginTop: 0,
    },
  },
});

const ProjectsPage = () => {
  const theme = useTheme();
  const classes = useMainPageStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { projects, fetchStatus, fetchError, sortBy } = useSelector(
    selectProjectsState
  );
  const [filterValue, setFilterValue] = useState('');

  const filteredSortedProjects = sortProjects(
    projects.filter((p) =>
      p.name.toLowerCase().includes(filterValue.toLowerCase())
    ),
    sortBy
  );

  const projectsDataToDisplay = () => {
    if (fetchStatus === 'loading') {
      return (
        <LoadingSpinner
          marginTop={isMobile ? '4em' : '9em'}
          size={isMobile ? 60 : 80}
        />
      );
    } else if (fetchStatus === 'succeeded' && projects.length === 0) {
      return (
        <InfoText
          text="No Projects added yet."
          variant={isMobile ? 'h6' : 'h5'}
        />
      );
    } else if (fetchStatus === 'failed' && fetchError) {
      return (
        <InfoText
          text={`Error: ${fetchError}`}
          variant={isMobile ? 'h6' : 'h5'}
        />
      );
    } else if (
      fetchStatus === 'succeeded' &&
      projects.length !== 0 &&
      filteredSortedProjects.length === 0
    ) {
      return (
        <InfoText text="No matches found." variant={isMobile ? 'h6' : 'h5'} />
      );
    } else {
      return (
        <div style={!isMobile ? classes.projectsListTable: classes.projectsListTable.mobileStyles}>
          {!isMobile ? (
            <ProjectsTable projects={filteredSortedProjects} />
          ) : (
            <ProjectsListMobile projects={filteredSortedProjects} />
          )}
        </div>
      );
    }
  };

  return (
    <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
      <Paper style={!isMobile ? classes.headerPaper: classes.headerPaper.mobileStyle}>
        {/* <ProjectSymbol
          fontSize="large"
          color="primary"
          style={!isMobile ? classes.headerIcon: classes.headerIcon}
        /> */}
        <img src={ProjectSymbol} alt="logo" style={!isMobile ? classes.headerIcon: classes.headerIcon.mobileStyle} />
        <div>
          <Typography variant={isMobile ? 'h6' : 'h5'} color="secondary">
            My Projects
          </Typography>
          <Typography
            variant={isMobile ? 'caption' : 'subtitle1'}
            color="secondary"
          >
            List of all projects that I have worked or have been working on.
          </Typography>
        </div>
      </Paper>
      <Paper style={!isMobile ? classes.projectsPaper: classes.projectsPaper.mobileStyle}>
        <ProjectActionCard
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          isMobile={isMobile}
        />
        {projectsDataToDisplay()}
      </Paper>
    </div>
  );
};

export default ProjectsPage;
