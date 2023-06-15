import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectProjectById,
    deleteProject,
    leaveProjectMembership,
} from '../redux/slices/projectsSlice';
import { selectAuthState } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import ProjectForm from './ProjectForm';
import MembersCard from './MembersCard';
import BugsCard from './BugsCard';
import ConfirmDialog from '../components/ConfirmDialog';
import FormDialog from '../components/FormDialog';
import { formatDateTime } from '../utils/helperFunc';

import {
    Paper,
    Typography,
    Button,
    Divider,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';

const useMainPageStyles = () => ({
    root: {
        padding: '1em 0',
        mobileStyle: {
            padding: '0.5em 0.5em',
        },
    },
    roundIconButton: {
        minWidth: 0,
        padding: '0.65em',
        borderRadius: '2em',
    },
    gotoIcon: {
        fontSize: '0.7em',
        marginLeft: '0.4em',
    },
    marginText: {
        marginBottom: '0.35em',
    },
    notFoundPaper: {
        padding: '1.5em',
        minHeight: 'calc(100vH - 130px)',
        mobileStyles: {
            padding: '0.5em 0.7em',
            minHeight: 'calc(100vH - 80px)',
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
    notFoundWrapper: {
        marginTop: '6em',
    },
    detailsHeader: {
        padding: '1.2em 1.5em',
        marginBottom: '1em',
        mobileStyles: {
            padding: '0.5em 0.7em',
            marginBottom: '0.5em',
        },
    },
    flexHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    btnsWrapper: {
        margin: '1em 0',
        mobileStyles: {
            margin: '0.5em 0',
        },
    },
});

type ParamTypes = {
    projectId: string;
}

const ProjectDetailsPage = () => {
    const classes = useMainPageStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { projectId } = useParams<ParamTypes>();
    const history = useNavigate();
    const dispatch = useDispatch();
    const [viewMembers, setViewMembers] = useState(false);
    const { user } = useSelector(selectAuthState);
    const projectInState = useSelector((state: RootState) =>
        selectProjectById(state, projectId!)
    );

    if (!projectInState) {
        return (
            <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
                <Paper style={!isMobile ? classes.notFoundPaper: classes.notFoundPaper.mobileStyles}>
                    <Typography
                        variant="h6"
                        color="secondary"
                        style={!isMobile ? classes.error404Text: classes.error404Text.mobileStyles as any}
                    >
                        404: Project Not Found!
                    </Typography>
                </Paper>
            </div>
        );
    }

    const { id, name, members, createdAt, updatedAt, createdBy } = projectInState;

    const isAdmin = createdBy.id === user?.id;

    const handleDeleteProject = () => {
        dispatch<any>(deleteProject(id, history));
    };

    const handleLeaveProject = () => {
        dispatch<any>(leaveProjectMembership(id, history));
    };

    const showMembersBtn = () => {
        if (members.length < 2) return null;

        if (isMobile) {
            return (
                <Button
                    color={viewMembers ? 'secondary' : 'primary'}
                    variant="contained"
                    onClick={() => setViewMembers(!viewMembers)}
                    style={{ ...classes.roundIconButton, ...{ marginRight: '1em' } }}
                >
                    {viewMembers ? <ExpandLessIcon /> : <PeopleAltTwoToneIcon />}
                </Button>
            );
        } else {
            return (
                <Button
                    color="secondary"
                    variant="outlined"
                    startIcon={viewMembers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => setViewMembers(!viewMembers)}
                    style={{ marginRight: '1em' }}
                >
                    {viewMembers ? 'Hide Members' : 'View Members'}
                </Button>
            );
        }
    };

    const leaveProjectBtn = () => {
        if (isAdmin) return null;

        return (
            <ConfirmDialog
                title="Confirm Leave Project"
                contentText="Are you sure you want to leave the project's membership?"
                actionBtnText="Leave Project"
                triggerBtn={{
                    type: isMobile ? 'round' : 'normal',
                    text: 'Leave Project',
                    icon: ExitToAppOutlinedIcon as any,
                }}
                actionFunc={handleLeaveProject}
            />
        );
    };

    const adminBtns = () => {
        if (!isAdmin) return null;

        return (
            <>
                <FormDialog
                    triggerBtn={{
                        type: isMobile ? 'round' : 'normal',
                        text: 'Add Members',
                        icon: GroupAddOutlinedIcon as any,
                        style: { marginRight: '1em' },
                    }}
                    title="Add members to project"
                >
                    <ProjectForm
                        editMode="members"
                        currentMembers={members.map((m) => m.member.id)}
                        projectId={id}
                    />
                </FormDialog>
                <ConfirmDialog
                    title="Confirm Delete Project"
                    contentText="Are you sure you want to permanently delete your project?"
                    actionBtnText="Delete Project"
                    triggerBtn={{
                        type: isMobile ? 'round' : 'normal',
                        text: 'Delete Project',
                        icon: DeleteOutlineIcon as any,
                    }}
                    actionFunc={handleDeleteProject}
                />
            </>
        );
    };

    return (
        <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
            <Paper style={!isMobile ? classes.detailsHeader: classes.detailsHeader.mobileStyles}>
                <div style={classes.flexHeader}>
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        color="secondary"
                        style={{ marginRight: '0.2em' }}
                    >
                        <strong>{name}</strong>
                    </Typography>
                    {isAdmin && (
                        <FormDialog
                            triggerBtn={{ type: 'icon', icon: EditIcon as any, size: 'small' }}
                            title="Edit the project name"
                        >
                            <ProjectForm editMode="name" currentName={name} projectId={id} />
                        </FormDialog>
                    )}
                </div>
                <Divider style={{ margin: '0.5em 0' }} />
                <Typography variant="subtitle2" color="secondary">
                    Admin: <strong>{createdBy.username}</strong>
                </Typography>
                <Typography variant="subtitle2" color="secondary">
                    Created At: <em>{formatDateTime(createdAt)}</em>
                </Typography>
                {createdAt !== updatedAt && (
                    <Typography variant="subtitle2" color="secondary">
                        Updated At: <em>{formatDateTime(updatedAt)}</em>
                    </Typography>
                )}
                <div style={!isMobile ? classes.btnsWrapper: classes.btnsWrapper}>
                    {showMembersBtn()}
                    {leaveProjectBtn()}
                    {adminBtns()}
                </div>
                {members.length > 1 && (
                    <MembersCard
                        members={members}
                        viewMembers={viewMembers}
                        adminId={createdBy.id}
                        projectId={id}
                        isMobile={isMobile}
                    />
                )}
            </Paper>
            <BugsCard projectId={projectId!} isMobile={isMobile} />
        </div>
    );
};

export default ProjectDetailsPage;
