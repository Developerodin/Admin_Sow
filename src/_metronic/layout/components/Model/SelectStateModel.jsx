import React from 'react';
import { Box, Button, MenuItem, Modal, TextField, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const SelectStateModel = ({
  modalVisible,
  setModalVisible,
  handleSelect,
  options,
  label,
}) => {
  return (
    <Modal
      open={modalVisible}
      onClose={() => setModalVisible(false)}
      closeAfterTransition
    >
      <Fade in={modalVisible}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <IconButton onClick={() => setModalVisible(false)} sx={{ alignSelf: "flex-end", color: "#65be34" }}>
            <CloseIcon />
          </IconButton>
          <TextField
            fullWidth
            label={label}
            onChange={handleSelect}
            select
            sx={{ marginTop: "20px" }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "right", alignItems: "center", marginTop: "15px" }}>
            <Button variant='contained' size='small' sx={{ backgroundColor: "black" }} onClick={() => setModalVisible(false)}>Submit</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
