import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProjectMember } from '../redux/types';
import { selectAuthState } from '../redux/slices/authSlice';
import { removeProjectMember } from '../redux/slices/projectsSlice';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateInWords } from '../utils/helperFunc';

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BlockIcon from '@mui/icons-material/Block';
import { useTheme } from '@mui/material';
import CSS from "csstype";

const useTableStyles = (theme: any) => ({
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

const memberHeaders = ['ID', 'Username', 'Role', 'Joined'];

const MembersTable: React.FC<{
    members: ProjectMember[];
    adminId: string;
    projectId: string;
    isMobile: boolean;
}> = ({ members, adminId, projectId, isMobile }) => {
    const theme = useTheme();
    const classes = useTableStyles(theme);
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuthState);

    const isAdmin = adminId === user?.id;

    const handleRemoveMember = (memberId: string) => {
        dispatch<any>(removeProjectMember(projectId, memberId));
    };

    return (
        <Paper style={classes.scrollableTable as CSS.Properties}>
            <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow>
                        {memberHeaders.map((m) => (
                            <TableCell key={m} align="center">
                                {m}
                            </TableCell>
                        ))}
                        {isAdmin && <TableCell align="center">Remove</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.map((m) => (
                        <TableRow key={m.id}>
                            <TableCell align="center">{m.id}</TableCell>
                            <TableCell align="center">
                                {m.member.username} {m.member.id === user?.id && '(You)'}
                            </TableCell>
                            <TableCell align="center">
                                {m.member.id === adminId ? 'Admin' : 'Member'}
                            </TableCell>
                            <TableCell align="center">
                                {formatDateInWords(m.joinedAt)}
                            </TableCell>
                            {isAdmin && (
                                <TableCell align="center">
                                    {m.member.id === user?.id ? (
                                        <BlockIcon
                                            color="secondary"
                                            fontSize={isMobile ? 'default' : 'large' as any}
                                        />
                                    ) : (
                                        <ConfirmDialog
                                            title="Confirm Remove Member"
                                            contentText={`Are you sure you want to remove ${m.member.username} from your project?`}
                                            actionBtnText="Remove Member"
                                            triggerBtn={{
                                                type: 'icon',
                                                iconSize: isMobile ? 'default' : 'large',
                                                icon: HighlightOffIcon as any,
                                                size: 'small',
                                            }}
                                            actionFunc={() => handleRemoveMember(m.member.id)}
                                        />
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default MembersTable;
