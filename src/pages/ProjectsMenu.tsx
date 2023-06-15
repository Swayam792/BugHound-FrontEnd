import { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  deleteProject,
  leaveProjectMembership,
} from '../redux/slices/projectsSlice';
import ConfirmDialog from '../components/ConfirmDialog';
import FormDialog from '../components/FormDialog';
import ProjectForm from './ProjectForm';

import { Menu, IconButton, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


interface ProjectsMenuProps {
  projectId: string;
  currentName: string;
  currentMembers: string[];
  isAdmin: boolean;
  iconSize?: 'small' | 'default' | 'large';
}

const ProjectsMenu: React.FC<ProjectsMenuProps> = ({
  projectId,
  currentName,
  currentMembers,
  isAdmin,
  iconSize,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteProject = () => {
    dispatch<any>(deleteProject(projectId, navigate));
  };

  const handleLeaveProject = () => {
    dispatch<any>(leaveProjectMembership(projectId, navigate));
  };

  return (
    <div>
      <IconButton onClick={handleOpenMenu} size="small">
        <MoreHorizIcon color="primary" fontSize={iconSize as any || 'large'} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        marginThreshold={8}
        elevation={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={handleCloseMenu}
          component={RouterLink}
          to={`/projects/${projectId}`}
        >
          <OpenInNewIcon style={{ marginRight: '10px' }} />
          Project Details
        </MenuItem>
        {!isAdmin && (
          <ConfirmDialog
            title="Confirm Leave Project"
            contentText="Are you sure you want to leave the project's membership?"
            actionBtnText="Leave Project"
            triggerBtn={{
              type: 'menu',
              text: 'Leave Project',
              icon: ExitToAppOutlinedIcon as any,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleLeaveProject}
          />
        )}
        {isAdmin && (
          <div>
            <FormDialog
              triggerBtn={{
                type: 'menu',
                icon: EditOutlinedIcon as any,
                text: 'Edit Name',
                iconStyle: { marginRight: '10px' },
                closeMenu: handleCloseMenu,
              }}
              title="Edit the project name"
            >
              <ProjectForm
                editMode="name"
                currentName={currentName}
                projectId={projectId}
              />
            </FormDialog>
            <FormDialog
              triggerBtn={{
                type: 'menu',
                text: 'Add Members',
                icon: GroupAddOutlinedIcon as any,
                iconStyle: { marginRight: '10px' },
                closeMenu: handleCloseMenu,
              }}
              title="Add members to project"
            >
              <ProjectForm
                editMode="members"
                currentMembers={currentMembers}
                projectId={projectId}
              />
            </FormDialog>
            <ConfirmDialog
              title="Confirm Delete Project"
              contentText="Are you sure you want to permanently delete your project?"
              actionBtnText="Delete Project"
              triggerBtn={{
                type: 'menu',
                text: 'Delete Project',
                icon: DeleteOutlineIcon as any,
                iconStyle: { marginRight: '10px' },
                closeMenu: handleCloseMenu,
              }}
              actionFunc={handleDeleteProject}
            />
          </div>
        )}
      </Menu>
    </div>
  );
};

export default ProjectsMenu;
