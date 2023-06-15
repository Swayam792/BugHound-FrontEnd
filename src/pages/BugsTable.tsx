import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { BugState } from '../redux/types';
import BugsMenu from './BugsMenu';
import { formatDateTime } from '../utils/helperFunc';
import { priorityStyles, statusStyles } from '../styles/customStyles';
import CSS from "csstype";

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Link,
    Paper,
    useTheme,
} from '@mui/material';

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
});

const tableHeaders = [
    'Title',
    'Priority',
    'Status',
    'Added',
    'Updated',
    'Notes',
    'Actions',
];

const BugsTable: React.FC<{ bugs: BugState[] }> = ({ bugs }) => {
    const theme = useTheme();
    const classes = useTableStyles(theme);
    const history = useNavigate();

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
                    {bugs.map((b) => (
                        <TableRow key={b.id}>
                            <TableCell
                                align="center"
                                onClick={() =>
                                    history(`/projects/${b.projectId}/bugs/${b.id}`)
                                }
                                style={classes.clickableCell as CSS.Properties}
                            >
                                <Link
                                    component={RouterLink}
                                    to={`/projects/${b.projectId}/bugs/${b.id}`}
                                    color="secondary"
                                >
                                    {b.title}
                                </Link>
                            </TableCell>
                            <TableCell align="center">
                                <div
                                    style={{
                                        ...priorityStyles(b.priority),
                                        textTransform: 'capitalize',
                                        margin: '0 auto',
                                    }}
                                >
                                    {b.priority}
                                </div>
                            </TableCell>
                            <TableCell align="center">
                                <div
                                    style={{
                                        ...statusStyles(b.isResolved),
                                        margin: '0 auto',
                                    }}
                                >
                                    {b.isResolved ? 'Closed' : 'Open'}
                                </div>
                            </TableCell>
                            <TableCell align="center">
                                {formatDateTime(b.createdAt)} ~ {b.createdBy.username}
                            </TableCell>
                            <TableCell align="center">
                                {!b.updatedAt || !b.updatedBy
                                    ? 'n/a'
                                    : `${formatDateTime(b.updatedAt)} ~ ${b.updatedBy.username}`}
                            </TableCell>
                            <TableCell align="center">{b.notes.length}</TableCell>
                            <TableCell align="center">
                                <BugsMenu
                                    projectId={b.projectId}
                                    bugId={b.id}
                                    currentData={{
                                        title: b.title,
                                        description: b.description,
                                        priority: b.priority,
                                    }}
                                    isResolved={b.isResolved}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default BugsTable;
