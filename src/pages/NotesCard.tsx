import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState } from '../redux/slices/authSlice';
import { selectProjectById } from '../redux/slices/projectsSlice';
import { deleteNote } from '../redux/slices/bugsSlice';
import { Note } from '../redux/types';
import { RootState } from '../redux/store';
import SortBar from '../components/SortBar';
import sortNotes from '../utils/sortNotes';
import NoteForm from './NoteForm';
import ConfirmDialog from '../components/ConfirmDialog';
import FormDialog from '../components/FormDialog';
import InfoText from '../components/InfoText';
import { formatTimeAgo } from '../utils/helperFunc';

import { Paper, Typography, Avatar, Divider, useTheme } from '@mui/material'; 
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';

const useMainPageStyles = (theme: any) => ({
    root: {
        padding: '1em 0',
        mobileStyles: {
            padding: '0.5em 0.5em',
        },
    },     
    flexHeader: {
        display: 'flex',
        alignItems: 'center',
    },     
    flexInput: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mobileStyles: {
            marginTop: '0.3em',
        },
    },     
    notesPaper: {
        padding: '1.5em',
        minHeight: 'calc(100vH - 420px)',
        mobileStyles: {
            padding: '0.5em 0.7em',
            minHeight: 'calc(100vH - 320px)',
        },
    },
    notesWrapper: {
        margin: '1.5em 0',
    },
    sortNotesInput: {
        width: '22%',
        mobileStyles: {
            width: '55%',
        },
    },
    singleNote: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '0.3em',
        marginTop: '0.8em',
    },
    noteBody: {
        marginTop: '0.2em',
    },
    avatar: {
        width: theme.spacing(4.8),
        height: theme.spacing(4.8),
        marginRight: '0.4em',
        marginTop: '0.3em',
        color: theme.palette.primary.main,
        backgroundColor: '#d3d3d3',
    },
    notesBtnWrapper: {
        margin: '0.5em 0',
    },    
   
});

export type NoteSortValues = 'newest' | 'oldest' | 'updated';

const menuItems = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'updated', label: 'Recently Updated' },
];

const NotesCard: React.FC<{
    notes: Note[];
    projectId: string;
    bugId: string;
    isMobile: boolean;
}> = ({ notes, projectId, bugId, isMobile }) => {
    const theme = useTheme();
    const classes = useMainPageStyles(theme);
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuthState);
    const project = useSelector((state: RootState) =>
        selectProjectById(state, projectId)
    );
    const [sortBy, setSortBy] = useState<NoteSortValues>('newest');

    const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSortBy(e.target.value as NoteSortValues);
    };

    const sortedNotes = sortNotes(notes, sortBy);

    const handleDeleteNote = (noteId: number) => {
        dispatch<any>(deleteNote(projectId, bugId, noteId));
    };

    return (
        <Paper style={!isMobile ? classes.notesPaper: classes.notesPaper.mobileStyles}>
            <div style={!isMobile ? classes.flexInput: classes.flexInput.mobileStyles}>
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    color="secondary"
                    style={classes.flexHeader}
                >
                    <ForumOutlinedIcon
                        fontSize={isMobile ? 'default' : 'large' as any}
                        style={{ marginRight: '0.2em' }}
                    />
                    Notes
                </Typography>
                <div style={!isMobile ? classes.sortNotesInput: classes.sortNotesInput.mobileStyles}>
                    <SortBar
                        sortBy={sortBy}
                        handleSortChange={handleSortChange}
                        menuItems={menuItems}
                        label="Notes"
                        size="small"
                    />
                </div>
            </div>
            <FormDialog
                triggerBtn={
                    isMobile
                        ? { type: 'fab', variant: 'round', icon: CommentOutlinedIcon }
                        : {
                            type: 'normal',
                            text: 'Leave A Note',
                            icon: CommentOutlinedIcon,
                            size: 'large',
                            style: { marginTop: '1em' },
                        } as any
                }
                title="Post a note"
            >
                <NoteForm isEditMode={false} projectId={projectId} bugId={bugId} />
            </FormDialog>
            <div style={classes.notesWrapper}>
                <Divider />
                {sortedNotes.length === 0 && (
                    <InfoText
                        text="No notes added yet."
                        variant={isMobile ? 'h6' : 'h5'}
                    />
                )}
                {sortedNotes.map((n) => (
                    <div key={n.id}>
                        <div style={classes.singleNote}>
                            <Avatar style={classes.avatar}>
                                {n.author.username.slice(0, 1)}
                            </Avatar>
                            <div>
                                <Typography color="secondary" variant="caption">
                                    {n.author.username}
                                </Typography>
                                <Typography color="secondary" variant="caption">
                                    <em> • {formatTimeAgo(n.createdAt)} ago</em>
                                </Typography>
                                {n.updatedAt !== n.createdAt && (
                                    <Typography color="secondary" variant="caption">
                                        {' '}
                                        • updated <em>{formatTimeAgo(n.updatedAt)} ago</em>
                                    </Typography>
                                )}
                                <Typography
                                    color="secondary"
                                    variant="subtitle1"
                                    style={classes.noteBody}
                                >
                                    {n.body}
                                </Typography>
                                <div style={classes.notesBtnWrapper}>
                                    {n.author.id === user?.id && (
                                        <FormDialog
                                            triggerBtn={{
                                                type: 'normal',
                                                text: 'Edit',
                                                icon: EditIcon as any,
                                                variant: 'outlined',
                                                size: 'small',
                                                style: { marginRight: '1em' },
                                                color: 'secondary',
                                            }}
                                            title="Edit the note"
                                        >
                                            <NoteForm
                                                isEditMode={true}
                                                projectId={projectId}
                                                bugId={bugId}
                                                noteId={n.id}
                                                currentBody={n.body}
                                            />
                                        </FormDialog>
                                    )}
                                    {(n.author.id === user?.id ||
                                        user?.id === project?.createdBy.id) && (
                                            <ConfirmDialog
                                                title="Confirm Delete Note"
                                                contentText="Are you sure you want to delete the note?"
                                                actionBtnText="Delete Note"
                                                triggerBtn={{
                                                    type: 'normal',
                                                    text: 'Delete',
                                                    icon: DeleteIcon as any,
                                                    variant: 'outlined',
                                                    size: 'small',
                                                    color: 'secondary',
                                                }}
                                                actionFunc={() => handleDeleteNote(n.id)}
                                            />
                                        )}
                                </div>
                            </div>
                        </div>
                        <Divider />
                    </div>
                ))}
            </div>
        </Paper>
    );
};

export default NotesCard;
