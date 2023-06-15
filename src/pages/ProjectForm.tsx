import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { createNewProject, editProjectName, addProjectMembers, selectProjectsState, clearSubmitProjectError } from '../redux/slices/projectsSlice';
import { selectUsersState } from '../redux/slices/usersSlice';
import { User } from '../redux/types';
import ErrorBox from '../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TextField, Button, ListItem, ListItemAvatar, ListItemText, Avatar, Chip, InputAdornment, useTheme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import GroupIcon from '@mui/icons-material/Group';

const useFormStyles = (theme: any) => ({
    avatar: {
        color: theme.palette.primary.main,
        backgroundColor: '#d3d3d3',
    },
    submitBtn: {
        marginTop: '1.5em',
        height: '3.2em',
    },
});

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Required')
        .max(60, 'Must be at most 60 characters'),
});

interface BaseType {
    closeDialog?: () => void;
}

interface CreateProject extends BaseType {
    editMode: null;
    currentName?: string;
    currentMembers?: string[];
    projectId?: string;
}

interface EditProjectName extends BaseType {
    editMode: 'name';
    currentName: string;
    projectId: string;
    currentMembers?: string[];
}

interface AddProjectMembers extends BaseType {
    editMode: 'members';
    currentMembers: string[];
    projectId: string;
    currentName?: string;
}

type ProjectFormProps = CreateProject | EditProjectName | AddProjectMembers;

const ProjectForm: React.FC<ProjectFormProps> = ({
    closeDialog,
    editMode,
    currentName,
    currentMembers,
    projectId,
}) => {
    const theme = useTheme();
    const classes = useFormStyles(theme);
    const dispatch = useDispatch();
    const { submitError, submitLoading } = useSelector(selectProjectsState);
    const { users } = useSelector(selectUsersState);
    const { register, handleSubmit, formState: {errors} } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: currentName || '',
        },
    });
    const [members, setMembers] = useState<string[]>([]);

    const selectMembersOnChange = (e: any, selectedOption: User[]) => {
        setMembers(selectedOption.map((s) => s.id));
    };

    const handleCreateProject = ({ name }: { name: string }) => {
        dispatch<any>(createNewProject({ name, members }, closeDialog));
    };

    const handleEditName = ({ name }: { name: string }) => {
        dispatch<any>(editProjectName(projectId as string, name, closeDialog));
    };

    const handleAddMembers = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();

        dispatch<any>(addProjectMembers(projectId as string, members, closeDialog));
    };
    return (
        <form
        style={{paddingTop: 10}}
            onSubmit={
                editMode !== 'members'
                    ? handleSubmit(
                        editMode === 'name' ? handleEditName : handleCreateProject
                    )
                    : handleAddMembers
            }
        >
            {editMode !== 'members' && (
                <TextField
                    {...register("name")}
                    name="name"
                    required
                    fullWidth
                    type="text"
                    label="Project Name"
                    variant="outlined"
                    error={errors.name as any}
                    helperText={errors.name ? errors.name?.message : ''}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LabelImportantIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
            )}
            {editMode !== 'name' && (
                <Autocomplete
                    style={{ marginTop: editMode !== 'members' ? '1.5em' : 0 }}
                    multiple
                    filterSelectedOptions 
                    onChange={selectMembersOnChange}
                    options={
                        editMode !== 'members'
                            ? users
                            : users.filter((u) => !currentMembers?.includes(u.id))
                    }
                    getOptionLabel={(option) => option.username}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            required={editMode === 'members'}
                            label="Select Members"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <InputAdornment
                                            position="start"
                                            style={{ paddingLeft: '0.4em' }}
                                        >
                                            <GroupIcon color="primary" />
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                            inputProps={{
                                ...params.inputProps,
                                required: members.length === 0 && editMode === 'members',
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <ListItem {...props} dense>
                            <ListItemAvatar>
                                <Avatar style={classes.avatar}>
                                    {option.username?.slice(0, 1)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={option.username}
                                primaryTypographyProps={{
                                    color: 'secondary',
                                    variant: 'body1',
                                }}
                            />
                        </ListItem>
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                avatar={<Avatar>{option.username?.slice(0, 1)}</Avatar>}
                                color="secondary"
                                variant="outlined"
                                label={option.username}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                />
            )}
            <Button
                size="large"
                color="primary"
                variant="contained"
                fullWidth
                style={classes.submitBtn}
                type="submit"
                disabled={submitLoading}
            >
                {editMode === 'name'
                    ? 'Update Project Name'
                    : editMode === 'members'
                        ? 'Add Project Members'
                        : 'Create New Project'}
            </Button>
            {submitError && (
                <ErrorBox
                    errorMsg={submitError}
                    clearErrorMsg={() => dispatch(clearSubmitProjectError())}
                />
            )}
        </form>
    );
};

export default ProjectForm;
