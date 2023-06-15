import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
    createNewBug,
    editBug,
    clearSubmitBugError,
    selectBugsState,
} from '../redux/slices/bugsSlice';
import { BugPayload } from '../redux/types';
import ErrorBox from '../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
    Button,
    InputAdornment,
    FormLabel,
    FormControl,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import SubjectIcon from '@mui/icons-material/Subject';
import CSS from "csstype";

const useFormStyles = (theme: any) => ({
    submitBtn: {
        marginTop: '1.5em',
        height: '3.2em',
    },
    avatar: {
        color: theme.palette.primary.main,
        backgroundColor: '#d3d3d3',
    },
    fieldMargin: {
        marginTop: '1.5em',
    },
    radioGroupForm: {
        marginTop: '0.8em',
        width: '100%',
    },
    radioGroup: {
        display: 'flex',
        alignItems: 'center',
    },
    radioGroupLabel: {
        marginRight: '2em',
    },
    formControlLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '80%',
        mobileStyles: {
            flexDirection: 'column',
            width: 'auto',
        },
    },
});

const validationSchema = yup.object({
    title: yup
        .string()
        .required('Required')
        .min(3, 'Must be at least 3 characters')
        .max(60, 'Must be at most 60 characters'),

    description: yup.string().required('Required'),
});

interface BugFormProps {
    closeDialog?: () => void;
    projectId: string;
    isEditMode: boolean;
    currentData?: BugPayload;
    bugId?: string;
}

const BugForm: React.FC<BugFormProps> = ({
    closeDialog,
    isEditMode,
    projectId,
    currentData,
    bugId,
}) => {
    const theme = useTheme();
    const classes = useFormStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { submitError, submitLoading } = useSelector(selectBugsState);
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: currentData?.title || '',
            description: currentData?.description || '',
            priority: currentData?.priority || 'low',
        },
    });

    const handleCreateBug = (data: BugPayload) => {
        dispatch<any>(createNewBug(projectId, data, closeDialog));
    };

    const handleUpdateBug = (data: BugPayload) => {
        console.log(data);
        dispatch<any>(editBug(projectId, bugId as string, data, closeDialog));
    };

    return (
        <form
            onSubmit={handleSubmit(isEditMode ? handleUpdateBug : handleCreateBug)}
        >
            <TextField
                {...register("title")}
                name="title"
                required
                fullWidth
                style={{ marginTop: "1em" }}
                type="text"
                label="Bug Title"
                variant="outlined"
                error={errors.title as any}
                helperText={errors.title ? errors.title?.message : ''}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <TitleIcon color="primary" />
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                style={classes.fieldMargin}
                multiline
                rows={1}
                {...register("description")}
                name="description"
                required
                fullWidth
                type="text"
                label="Description"
                variant="outlined"
                error={errors.description as any}
                helperText={errors.description ? errors.description?.message : ''}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SubjectIcon color="primary" />
                        </InputAdornment>
                    ),
                }}
            />
            <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                    <RadioGroup row defaultValue="low" style={classes.radioGroup} {...field}>
                        <FormLabel style={classes.radioGroupLabel}>
                            Priority:
                        </FormLabel>
                        <div style={!isMobile ? classes.formControlLabels as CSS.Properties : classes.formControlLabels.mobileStyles as CSS.Properties}>
                            <FormControlLabel
                                value="low"
                                control={<Radio color="primary" />}
                                label="Low"
                            />
                            <FormControlLabel
                                value="medium"
                                control={<Radio color="primary" />}
                                label="Medium"
                            />
                            <FormControlLabel
                                value="high"
                                control={<Radio color="primary" />}
                                label="High"
                            />
                        </div>
                    </RadioGroup>
                )
                }
            />
            <Button
                size="large"
                color="primary"
                variant="contained"
                fullWidth
                style={classes.submitBtn}
                type="submit"
                disabled={submitLoading}
            >
                {isEditMode ? 'Update Bug' : 'Create New Bug'}
            </Button>
            {submitError && (
                <ErrorBox
                    errorMsg={submitError}
                    clearErrorMsg={() => dispatch(clearSubmitBugError())}
                />
            )}
        </form>
    );
};

export default BugForm;
