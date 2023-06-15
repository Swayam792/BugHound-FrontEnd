import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const FilterBar: React.FC<{
  filterValue: string;
  setFilterValue: (filterValue: string) => void;
  label: string;
  size?: 'small' | 'medium';
}> = ({ filterValue, setFilterValue, label, size }) => {
  return (
    <div>
      <div>
        <TextField
          value={filterValue}
          fullWidth
          size={size || 'medium'}
          type="text"
          label={`Search ${label}`}
          variant="outlined"
          onChange={(e) => setFilterValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  color="primary"
                  fontSize={size === 'small' ? 'default' : 'large' as any}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                {filterValue !== '' ? (
                  <IconButton onClick={() => setFilterValue('')} size="small">
                    <ClearIcon
                      color="primary"
                      fontSize={size === 'small' ? 'default' : 'large' as any}
                    />
                  </IconButton>
                ) : (
                  <div></div>
                )}
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default FilterBar;
