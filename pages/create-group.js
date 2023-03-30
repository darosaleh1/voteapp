import React, { useContext, useState } from 'react';
import { GroupContext } from '@/context/GroupContext';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
// Used MaterialUI library for the form
const CreateGroupButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0d1b2a',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#fff',
    color: '#0d1b2a',
  },
}));

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const { createNewGroup } = useContext(GroupContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNewGroup(groupName, isPrivate, password);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', alignItems: 'center', background: '#0d1b2a' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#0d1b2a',
          border: '1px solid #fff',
          borderRadius: '8px',
          padding: 4,
          width: '50%',
          minWidth: '300px',
          maxWidth: '500px',
        }}
      >
        <h1 style={{ color: '#fff' }}>Create a New Group</h1>
        <TextField
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff', borderBottom: '1px solid #fff' } }}
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              sx={{ color: '#fff' }}
            />
          }
          label="Private"
          sx={{ color: '#fff' }}
        />
        {isPrivate && (
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ style: { color: '#fff' } }}
            InputProps={{ style: { color: '#fff', borderBottom: '1px solid #fff' } }}
          />
        )}
        <br />
        <CreateGroupButton type="submit" variant="contained">
          Create Group
        </CreateGroupButton>
      </Box>
    </div>
  );
};

export default CreateGroup;




