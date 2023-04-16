import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { PollContext } from '@/context/PollContext';
import { styled } from '@mui/system';
import { useRouter } from 'next/router'; // Import useRouter

const CreatePollButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0d1b2a',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#fff',
    color: '#0d1b2a',
  },
}));

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [duration, setDuration] = useState('');
  
    const { createPoll } = useContext(PollContext);
    const router = useRouter();
  
    const groupAddress = router.query.groupAddress;
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createPoll(groupAddress, question, option1, option2, parseInt(duration) * 60);
        
        setTimeout(() => {
          router.push(`/group/${groupAddress}`);
        }, 3000);
      } catch (error) {
        console.error('Error creating poll:', error);
      }
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
        <h1 style={{ color: '#fff' }}>Create a New Poll</h1>
        <TextField
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff', borderBottom: '1px solid #fff' } }}
        />
        <br />
        <TextField
          label="Option 1"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff', borderBottom: '1px solid #fff' } }}
        />
        <br />
        <TextField
          label="Option 2"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff', borderBottom: '1px solid #fff' } }}
        />
        <br />
        <TextField
          label="Duration (minutes)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff', borderBottom: '1px solid #fff' } }}
        />
        <br />
        <CreatePollButton type="submit" variant="contained">
          Create Poll
        </CreatePollButton>
      </Box>
    </div>
  );
};

export default CreatePoll;
