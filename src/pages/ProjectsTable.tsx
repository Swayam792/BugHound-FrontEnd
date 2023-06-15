import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProjectState } from '../redux/types';
import { selectAuthState } from '../redux/slices/authSlice';
import ProjectsMenu from './ProjectsMenu';
import { formatDateTime,  truncateString} from '../utils/helperFunc';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Paper,
} from '@mui/material'; 
import CSS from "csstype"
import { useTheme } from '@mui/material';

const useTableStyles = (theme: any) => ({
    table: {
        '& thead th': {
          fontWeight: '600',
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.primary.light,
        },
      },
      clickableCell: {
        '&:hover': {
          backgroundColor: theme.palette.primary.main + '15',
          cursor: 'pointer',
        },
      },
      scrollableTable: {
        '& thead th': {
          fontWeight: '600',
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.primary.light,
        },
        overflowY: 'auto',
        maxHeight: '350px',
      },
});

const tableHeaders = ['Name', 'Bugs', 'Members', 'Admin', 'Added', 'Actions'];

const ProjectsTable: React.FC<{ projects: ProjectState[] }> = ({
  projects,
}) => {
  const theme = useTheme();
  const classes = useTableStyles(theme);
  const navigate = useNavigate();
  const { user } = useSelector(selectAuthState);

  return (
    <Paper style={classes.table as CSS.Properties}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaders.map((t) => (
              <TableCell key={t} align="center">
                {t}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell
                onClick={() => navigate(`/projects/${p.id}`)}
                style={classes.clickableCell as CSS.Properties}
                align="center"
              >
                <Link
                  component={RouterLink}
                  to={`/projects/${p.id}`}
                  color="secondary"
                >
                  {truncateString(p.name, 30)}
                </Link>
              </TableCell>
              <TableCell align="center">{p.bugs.length}</TableCell>
              <TableCell align="center">{p.members.length}</TableCell>
              <TableCell align="center">{p.createdBy.username}</TableCell>
              <TableCell align="center">
                {formatDateTime(p.createdAt)}
              </TableCell>
              <TableCell align="center">
                <ProjectsMenu
                  projectId={p.id}
                  currentName={p.name}
                  currentMembers={p.members.map((m) => m.member.id)}
                  isAdmin={p.createdBy.id === user?.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ProjectsTable;
