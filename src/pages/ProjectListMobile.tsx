import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProjectState } from '../redux/types';
import { selectAuthState } from '../redux/slices/authSlice';
import ProjectsMenu from './ProjectsMenu';
import { formatDateTime, truncateString } from '../utils/helperFunc';

import { Divider, Typography, Link } from '@mui/material';
import BugReportTwoToneIcon from '@mui/icons-material/BugReportTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const useMainPageStyles = () => ({          
 
    iconText: {
        verticalAlign: 'middle',
        display: 'inline-flex',
    },
    textIconsWrapper: {
        display: 'flex',
        width: '100px',
        justifyContent: 'space-between',
    },
    listItemWrapper: {
        padding: '0.4em 0.3em',
    },
    flexedWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.3em',
    },
     
    gotoIcon: {
        fontSize: '0.7em',
        marginLeft: '0.4em',
    },  
});

const ProjectsListMobile: React.FC<{ projects: ProjectState[] }> = ({
    projects,
}) => {
    const classes = useMainPageStyles();
    const { user } = useSelector(selectAuthState);

    return (
        <div>
            <Divider />
            {projects.map((p, i) => (
                <div
                    key={p.id}
                    style={{ paddingBottom: i + 1 === projects.length ? '2em' : 0 }}
                >
                    <div style={classes.listItemWrapper}>
                        <Link
                            component={RouterLink}
                            to={`/projects/${p.id}`}
                            color="secondary"
                            variant="h6"
                        >
                            {truncateString(p.name, 30)}
                            <OpenInNewIcon color="primary" style={classes.gotoIcon} />
                        </Link>
                        <Typography variant="body2" color="secondary">
                            Admin: <strong>{p.createdBy.username}</strong>
                        </Typography>
                        <Typography variant="body2" color="secondary">
                            Created: <strong>{formatDateTime(p.createdAt)}</strong>
                        </Typography>
                        <div style={classes.flexedWrapper}>
                            <div style={classes.textIconsWrapper}>
                                <div style={classes.iconText}>
                                    <BugReportTwoToneIcon color="secondary" />
                                    <Typography variant="subtitle1" color="secondary">
                                        : {p.bugs.length}
                                    </Typography>
                                </div>
                                <div style={classes.iconText}>
                                    <PeopleAltTwoToneIcon color="secondary" />{' '}
                                    <Typography variant="subtitle1" color="secondary">
                                        : {p.members.length}
                                    </Typography>
                                </div>
                            </div>
                            <ProjectsMenu
                                projectId={p.id}
                                currentName={p.name}
                                currentMembers={p.members.map((m) => m.member.id)}
                                isAdmin={p.createdBy.id === user?.id}
                                iconSize="default"
                            />
                        </div>
                    </div>
                    <Divider />
                </div>
            ))}
        </div>
    );
};

export default ProjectsListMobile;
