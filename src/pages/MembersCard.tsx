import React, { useState } from 'react';
import MembersTable from './MembersTable';
import FilterBar from '../components/FilterBar';
import { ProjectMember } from '../redux/types';
import InfoText from '../components/InfoText';

import { Typography, Collapse } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

const useMainPageStyles = () => ({
    flexHeader: {
        display: 'flex',
        alignItems: 'center',
    },   
    membersWrapper: {
        marginTop: '1em',
    },
    filterMembersInput: {
        mobileStyles: {
            width: '55%',
        },
    },
    flexInput: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mobileStyles: {
            marginTop: '0.3em',
        },
    },
});

const MembersCard: React.FC<{
    members: ProjectMember[];
    viewMembers: boolean;
    adminId: string;
    projectId: string;
    isMobile: boolean;
}> = ({ members, viewMembers, adminId, projectId, isMobile }) => {
    const classes = useMainPageStyles();
    const [filterValue, setFilterValue] = useState('');

    const filteredMembers = members.filter((m) =>
        m.member.username.toLowerCase().includes(filterValue.toLowerCase())
    );

    const membersDataToDisplay = () => {
        if (filteredMembers.length === 0) {
            return (
                <InfoText text="No matches found." variant={isMobile ? 'h6' : 'h5'} />
            );
        } else {
            return (
                <div style={{ marginTop: '1em' }}>
                    <MembersTable
                        members={filteredMembers}
                        adminId={adminId}
                        projectId={projectId}
                        isMobile={isMobile}
                    />
                </div>
            );
        }
    };

    return (
        <Collapse
            in={viewMembers}
            timeout="auto"
            unmountOnExit
            style={classes.membersWrapper}
        >
            <div style={!isMobile ? classes.flexInput: classes.flexInput.mobileStyles}>
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    color="secondary"
                    style={classes.flexHeader}
                >
                    <PeopleAltOutlinedIcon
                        fontSize={isMobile ? 'default' : 'large' as any}
                        style={{ marginRight: '0.2em' }}
                    />
                    Members
                </Typography>
                <div style={!isMobile ? classes.filterMembersInput: classes.filterMembersInput.mobileStyles as any}>
                    <FilterBar
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        label="Members"
                        size="small"
                    />
                </div>
            </div>
            {membersDataToDisplay()}
        </Collapse>
    );
};

export default MembersCard;
