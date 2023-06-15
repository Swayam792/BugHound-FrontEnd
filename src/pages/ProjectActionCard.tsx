import { useDispatch, useSelector } from 'react-redux';
import FilterBar from '../components/FilterBar';
import SortBar from '../components/SortBar';
import FormDialog from '../components/FormDialog';
import ProjectForm from './ProjectForm';
import { ProjectSortValues } from '../redux/types';
import {
    sortProjectsBy,
    selectProjectsState,
} from '../redux/slices/projectsSlice';

import AddIcon from '@mui/icons-material/Add';

const useActionCardStyles = () => ({
    inputs: {
        display: 'flex',
        minWidth: '100%',
        justifyContent: 'space-between',
        marginBottom: '1.5em',
        mobileStyle: {
            marginBottom: '0.7em',
        },
    },
    searchBarWrapper: {
        width: '70%',
        mobileStyle: {
            width: '55%',
        },
    },
    sortBarWrapper: {
        width: '25%',
        mobileStyle: {
            width: '42%',
        },
    },
});

const menuItems = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'Name (A - Z)' },
    { value: 'z-a', label: 'Name (Z - A)' },
    { value: 'most-bugs', label: 'Most Bugs' },
    { value: 'least-bugs', label: 'Least Bugs' },
    { value: 'most-members', label: 'Most Members' },
    { value: 'least-members', label: 'Least Members' },
];

const ProjectsActionCard: React.FC<{
    filterValue: string;
    setFilterValue: (filterValue: string) => void;
    isMobile: boolean;
}> = ({ filterValue, setFilterValue, isMobile }) => {
    const classes = useActionCardStyles();
    const dispatch = useDispatch();
    const { sortBy } = useSelector(selectProjectsState);

    const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const selectedValue = e.target.value as ProjectSortValues;
        dispatch(sortProjectsBy(selectedValue));
    };

    return (
        <div>
            <div style={classes.inputs}>
                <div style={classes.searchBarWrapper}>
                    <FilterBar
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        label="Projects"
                        size={isMobile ? 'small' : 'medium'}
                    />
                </div>
                <div style={classes.sortBarWrapper}>
                    <SortBar
                        sortBy={sortBy}
                        handleSortChange={handleSortChange}
                        menuItems={menuItems}
                        label="Projects"
                        size={isMobile ? 'small' : 'medium'}
                    />
                </div>
            </div>
            <FormDialog
                triggerBtn={
                    isMobile
                        ? {
                            type: 'fab',
                            variant: 'extended',
                            text: 'Project',
                            icon: AddIcon,
                        }
                        : {
                            type: 'normal',
                            text: 'Add Project',
                            icon: AddIcon,
                            size: 'large',
                        } as any
                }
                title="Add a new project"
            >
                <ProjectForm editMode={null} />
            </FormDialog>
        </div>
    );
};

export default ProjectsActionCard;
