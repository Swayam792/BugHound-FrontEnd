import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectBugById,
    deleteBug,
    closeReopenBug,
} from '../redux/slices/bugsSlice';
import { RootState } from '../redux/store';
import FormDialog from '../components/FormDialog';
import BugForm from './BugForm';
import ConfirmDialog from '../components/ConfirmDialog';
import NotesCard from './NotesCard';
import { formatDateTime } from '../utils/helperFunc';
import { priorityStyles, statusStyles } from '../styles/customStyles';
import CSS from 'csstype';

import { Paper, Typography, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import RedoIcon from '@mui/icons-material/Redo';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const useMainPageStyles = () => ({
    root: {
        padding: '1em 0',
        mobileStyle: {
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
    btnsWrapper: {
        margin: '1em 0',
        mobileStyles: {
            margin: '0.5em 0',
        },
    },
    marginText: {
        marginBottom: '0.35em',
    },
    detailsHeader: {
        padding: '1.2em 1.5em',
        marginBottom: '1em',
        mobileStyles: {
            padding: '0.5em 0.7em',
            marginBottom: '0.5em',
        },
    },
});

type ParamTypes = {
    projectId: string;
    bugId: string;
}

const BugsDetailsPage = () => {
    const classes = useMainPageStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { projectId, bugId } = useParams<ParamTypes>();
    const history = useNavigate();
    const dispatch = useDispatch();
    const bug = useSelector((state: RootState) =>
        selectBugById(state, projectId!, bugId!)
    );

    if (!bug) {
        return (
            <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
                <Paper style={!isMobile ? classes.notFoundPaper: classes.notFoundPaper.mobileStyles}>
                    <Typography
                        variant="h6"
                        color="secondary"
                        style={{ ...classes.error404Text, ...{ marginTop: '5em' } as any}}
                    >
                        404: Bug Not Found!
                    </Typography>
                </Paper>
            </div>
        );
    }

    const {
        id,
        title,
        description,
        priority,
        isResolved,
        createdBy,
        createdAt,
        updatedBy,
        updatedAt,
        closedBy,
        closedAt,
        reopenedBy,
        reopenedAt,
        notes,
    } = bug;

    const handleDeleteBug = () => {
        dispatch<any>(deleteBug(projectId!, bugId!, history));
    };

    const handleCloseBug = () => {
        dispatch<any>(closeReopenBug(projectId!, bugId!, 'close'));
    };

    const handleReopenBug = () => {
        dispatch<any>(closeReopenBug(projectId!, bugId!, 'reopen'));
    };

    const statusCSS: CSS.Properties = {
        ...statusStyles(isResolved),
        display: 'inline',
        padding: '0.20em 0.4em',
    };

    const statusInfo = () => {
        if (!isResolved && reopenedAt && reopenedBy) {
            return (
                <span>
                    <div style={statusCSS}>Re-opened</div> -{' '}
                    <em>{formatDateTime(reopenedAt)}</em> ~{' '}
                    <strong>{reopenedBy.username}</strong>
                </span>
            );
        } else if (isResolved && closedAt && closedBy) {
            return (
                <span>
                    <div style={statusCSS}>Closed</div> -{' '}
                    <em>{formatDateTime(closedAt)}</em> ~{' '}
                    <strong>{closedBy.username}</strong>
                </span>
            );
        } else {
            return <div style={statusCSS}>Open</div>;
        }
    };

    const closeReopenBtns = () => {
        if (isResolved) {
            return (
                <ConfirmDialog
                    title="Re-open the Bug"
                    contentText="Are you sure you want to re-open the bug?"
                    actionBtnText="Re-open Bug"
                    triggerBtn={{
                        type: isMobile ? 'round' : 'normal',
                        text: 'Re-open Bug',
                        icon: RedoIcon as any,
                    }}
                    actionFunc={handleReopenBug}
                />
            );
        } else {
            return (
                <ConfirmDialog
                    title="Close the Bug"
                    contentText="Are you sure you want to close the bug?"
                    actionBtnText="Close Bug"
                    triggerBtn={{
                        type: isMobile ? 'round' : 'normal',
                        text: 'Close Bug',
                        icon: DoneOutlineIcon as any,
                    }}
                    actionFunc={handleCloseBug}
                />
            );
        }
    };

    const updateBugBtn = () => {
        return (
            <FormDialog
                triggerBtn={{
                    type: isMobile ? 'round' : 'normal',
                    text: 'Update Bug Info',
                    icon: EditOutlinedIcon as any,
                    style: { marginLeft: '1em' },
                }}
                title="Edit the bug details"
            >
                <BugForm
                    isEditMode={true}
                    projectId={projectId!}
                    bugId={id}
                    currentData={{ title, description, priority }}
                />
            </FormDialog>
        );
    };

    const deleteBugBtn = () => {
        return (
            <ConfirmDialog
                title="Confirm Delete Bug"
                contentText="Are you sure you want to permanently delete the bug?"
                actionBtnText="Delete Bug"
                triggerBtn={{
                    type: isMobile ? 'round' : 'normal',
                    text: 'Delete Bug',
                    icon: DeleteOutlineIcon as any,
                    style: { marginLeft: '1em' },
                }}
                actionFunc={handleDeleteBug}
            />
        );
    };

    return (
        <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
            <Paper style={!isMobile ? classes.detailsHeader: classes.detailsHeader.mobileStyles}>
                <Typography variant={isMobile ? 'h5' : 'h4'} color="secondary">
                    <strong>{title}</strong>
                </Typography>
                <Divider style={{ margin: '0.5em 0' }} />
                <Typography color="secondary" variant="h6">
                    {description}
                </Typography>
                <Typography
                    color="secondary"
                    variant="subtitle2"
                    style={classes.marginText}
                >
                    Status: {statusInfo()}
                </Typography>
                <Typography
                    color="secondary"
                    variant="subtitle2"
                    style={classes.marginText}
                >
                    Priority:{' '}
                    <div
                        style={{
                            ...priorityStyles(priority),
                            display: 'inline',
                            padding: '0.20em 0.4em',
                            textTransform: 'capitalize',
                        }}
                    >
                        {priority}
                    </div>
                </Typography>
                <Typography color="secondary" variant="subtitle2">
                    Created: <em>{formatDateTime(createdAt)}</em> ~{' '}
                    <strong>{createdBy.username}</strong>
                </Typography>
                {updatedBy && updatedAt && (
                    <Typography color="secondary" variant="subtitle2">
                        Updated: <em>{formatDateTime(updatedAt)}</em> ~{' '}
                        <strong>{updatedBy.username}</strong>
                    </Typography>
                )}
                <div style={!isMobile ? classes.btnsWrapper: classes.btnsWrapper.mobileStyles}>
                    {closeReopenBtns()}
                    {updateBugBtn()}
                    {deleteBugBtn()}
                </div>
            </Paper>
            <NotesCard
                notes={notes}
                projectId={projectId!}
                bugId={id}
                isMobile={isMobile}
            />
        </div>
    );
};

export default BugsDetailsPage;
